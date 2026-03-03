using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InternalDashboard.Data;       // AppDbContext
using InternalDashboard.Models;     // User, LoginRequest, RegisterRequest
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// ────────────────────────────────────────────────
// JWT Authentication
// ────────────────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("this-is-a-super-secret-key-at-least-32-chars-long-2025!")
            ),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ────────────────────────────────────────────────
// SQLite + EF Core
// ────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// ────────────────────────────────────────────────
// Swagger
// ────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Internal Dashboard API",
        Version = "v1",
        Description = "JWT + SQLite + BCrypt demo"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ────────────────────────────────────────────────
// ONE-TIME STARTUP MIGRATION (padam selepas pertama kali berjaya)
// ────────────────────────────────────────────────
Console.WriteLine("=== STARTUP MIGRATION CHECK ===");
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    Console.WriteLine("DbContext resolved OK.");
    Console.WriteLine("Connection string: " + db.Database.GetConnectionString());

    Console.WriteLine("Applying migrations...");
    db.Database.Migrate();

    Console.WriteLine("MIGRATION SUCCESS! Table 'Users' and seed data ready.");
}
catch (Exception ex)
{
    Console.WriteLine("!!! STARTUP MIGRATION FAILED !!!");
    Console.WriteLine("Error: " + ex.Message);
    if (ex.InnerException != null)
    {
        Console.WriteLine("Inner exception: " + ex.InnerException.Message);
    }
    Console.WriteLine("Stack trace: " + ex.StackTrace);
}
Console.WriteLine("=== END STARTUP MIGRATION ===");

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Internal Dashboard API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// ────────────────────────────────────────────────
// Register new user
// ────────────────────────────────────────────────
app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
    {
        return Results.BadRequest("Username dan password diperlukan");
    }

    if (await db.Users.AnyAsync(u => u.Username.ToLower() == req.Username.ToLower()))
    {
        return Results.BadRequest("Username sudah wujud");
    }

    var newUser = new User
    {
        Username = req.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        Role = "User"  // default role
    };

    db.Users.Add(newUser);
    await db.SaveChangesAsync();

    return Results.Created($"/api/users/{newUser.Id}", new
    {
        message = "User berjaya didaftar",
        username = newUser.Username,
        role = newUser.Role
    });
})
.WithName("Register");

// ────────────────────────────────────────────────
// Login – check database dengan BCrypt
// ────────────────────────────────────────────────
app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db) =>
{
    var user = await db.Users
        .FirstOrDefaultAsync(u => u.Username == req.Username);

    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    var claims = new[]
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes("this-is-a-super-secret-key-at-least-32-chars-long-2025!"));

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return Results.Ok(new
    {
        token = new JwtSecurityTokenHandler().WriteToken(token),
        expires = token.ValidTo.ToString("o")
    });
})
.WithName("Login");

// ────────────────────────────────────────────────
// Any authenticated user
// ────────────────────────────────────────────────
app.MapGet("/api/users", () =>
{
    var users = new[]
    {
        new { Id = 1, Name = "Alice", Role = "Admin" },
        new { Id = 2, Name = "Bob", Role = "User" },
        new { Id = 3, Name = "Charlie", Role = "User" }
    };

    return Results.Ok(users);
})
.RequireAuthorization()
.WithName("GetUsers");

// ────────────────────────────────────────────────
// Admin only
// ────────────────────────────────────────────────
app.MapGet("/api/admin/dashboard", () =>
{
    return Results.Ok(new 
    { 
        message = "Welcome to Admin Dashboard! Only Admins allowed." 
    });
})
.RequireAuthorization(policy => policy.RequireRole("Admin"))
.WithName("AdminDashboard");

// ────────────────────────────────────────────────
// Run the app
// ────────────────────────────────────────────────
app.Run();

// ────────────────────────────────────────────────
// Models
// ────────────────────────────────────────────────
record LoginRequest(string Username, string Password);
record RegisterRequest(string Username, string Password);