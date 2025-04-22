using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Tests.Helpers;

public class DatabaseHelper
{
    private readonly HttpClient _client;
    
    public DatabaseHelper(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
        
    public static DatabaseContext InMemoryDatabaseContext { get; } = CreateInMemoryDatabaseContext();

    private static DatabaseContext CreateInMemoryDatabaseContext()
    {
        // Use in-memory database for testing
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase("TestDatabase")
            .Options;
        var db = new DatabaseContext(options);

        var pwdHasher = new PasswordHasher<User>();

        var testUser = new User
        {
            Id = 1,
            RoleId = 1,
            Username = "user1",
            Email = "user1@gmail.com",
            FirstName = "firstname1",
        };

        testUser.Password = pwdHasher.HashPassword(testUser, "password1");

        var testAdmin = new User
        {
            Id = 2,
            RoleId = 2,
            Username = "user3",
            Email = "user3@gmail.com",
            FirstName = "firstname3",
        };

        testAdmin.Password = pwdHasher.HashPassword(testAdmin, "password3");

        db.Roles.Add(new Models.Role { Id = 1, Name = "User" });
        db.Roles.Add(new Models.Role { Id = 2, Name = "Admin" });

        db.Users.Add(testUser);
        db.Users.Add(testAdmin);

        db.SaveChanges();

        return db;
    }
}