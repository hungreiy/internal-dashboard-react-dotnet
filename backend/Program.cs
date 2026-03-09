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

// Create builder
var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────
// JWT Authentication
// ──────────────────────────────
var jwtKey = "this-is-a-super-secret-key-at-least-32-chars-long-2025!";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ──────────────────────────────
// PostgreSQL EF Core
// ──────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ──────────────────────────────
// Swagger
// ──────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Internal Dashboard API", Version = "v1" });
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
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ──────────────────────────────
// Apply Migrations on Startup
// ──────────────────────────────
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    Console.WriteLine("Migrations applied successfully!");
}
catch (Exception ex)
{
    Console.WriteLine("Migration failed: " + ex.Message);
}

// ──────────────────────────────
// Middleware
// ──────────────────────────────
app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Internal Dashboard API v1"); c.RoutePrefix = "swagger"; });

app.UseAuthentication();
app.UseAuthorization();

// ──────────────────────────────
// API Endpoints
// ──────────────────────────────

// Register
app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
        return Results.BadRequest("Username dan password diperlukan");

    if (await db.Users.AnyAsync(u => u.Username.ToLower() == req.Username.ToLower()))
        return Results.BadRequest("Username sudah wujud");

    var newUser = new User
    {
        Username = req.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        Role = "User"
    };

    db.Users.Add(newUser);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "User berjaya didaftar", user = newUser.Username });
});

// Login
app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Results.Unauthorized();

    var claims = new[]
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expires = token.ValidTo });
});

// Authenticated Users
app.MapGet("/api/users", () =>
{
    var users = new[]
    {
        new { Id = 1, Name = "Alice", Role = "Admin" },
        new { Id = 2, Name = "Bob", Role = "User" }
    };
    return Results.Ok(users);
}).RequireAuthorization();

// Admin Only
app.MapGet("/api/admin/dashboard", () => Results.Ok(new { message = "Welcome Admin!" }))
    .RequireAuthorization(policy => policy.RequireRole("Admin"));

// ──────────────────────────────
// Bind to Railway PORT
// ──────────────────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");

app.Run();

// ──────────────────────────────
// Models
// ──────────────────────────────
record LoginRequest(string Username, string Password);
record RegisterRequest(string Username, string Password);