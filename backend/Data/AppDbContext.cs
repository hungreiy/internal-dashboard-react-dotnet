using Microsoft.EntityFrameworkCore;
using InternalDashboard.Models;
using BCrypt.Net;

namespace InternalDashboard.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data dengan password HASHED menggunakan BCrypt
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "test",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "User"
            },
            new User
            {
                Id = 2,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin"
            }
        );
    }
}
