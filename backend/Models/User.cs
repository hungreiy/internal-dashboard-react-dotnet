// Models/User.cs
namespace InternalDashboard.Models;

/// <summary>
/// Represents a user in the system with authentication and role information.
/// Password is stored as hashed value (BCrypt).
/// </summary>
public class User
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Hashed password using BCrypt (never store plaintext!)
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// User role for authorization (e.g. "User" or "Admin")
    /// </summary>
    public string Role { get; set; } = "User";
}
