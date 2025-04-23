using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Tests.Helpers;

public class DatabaseHelper
{
    public static DatabaseContext CreateInMemoryDatabaseContext()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new DatabaseContext(options);

        SeedDatabase(db);

        return db;
    }

    public static async Task RestoreDatabase(DatabaseContext db)
    {
        db.Users.RemoveRange(db.Users);
        db.Roles.RemoveRange(db.Roles);
        db.Data.RemoveRange(db.Data);

        await db.SaveChangesAsync();

        SeedDatabase(db);
    }

    private static void SeedDatabase(DatabaseContext db)
    {
        var pwdHasher = new PasswordHasher<User>();

        var testUser1 = new User
        {
            Id = 1,
            RoleId = 1,
            Username = "user1",
            Email = "user1@gmail.com",
            FirstName = "firstname1",
        };

        testUser1.Password = pwdHasher.HashPassword(testUser1, "password1");

        var testUser2 = new User
        {
            Id = 2,
            RoleId = 1,
            Username = "user2",
            Email = "user2@gmail.com",
            FirstName = "firstname2",
        };

        testUser2.Password = pwdHasher.HashPassword(testUser2, "password2");

        var testAdmin = new User
        {
            Id = 3,
            RoleId = 2,
            Username = "user3",
            Email = "user3@gmail.com",
            FirstName = "firstname3",
        };

        testAdmin.Password = pwdHasher.HashPassword(testAdmin, "password3");

        var testDatum1 = new Datum
        {
            Id = 1,
            Col1 = "Val11",
            Col2 = "Val12",
            Col3 = "Val13"
        };

        var testDatum2 = new Datum
        {
            Id = 2,
            Col1 = "Val21",
            Col2 = "Val22",
            Col3 = "Val23"
        };

        var testDatum3 = new Datum
        {
            Id = 3,
            Col1 = "Val31",
            Col2 = "Val32",
            Col3 = "Val33"
        };

        db.Roles.Add(new Models.Role { Id = 1, Name = "User" });
        db.Roles.Add(new Models.Role { Id = 2, Name = "Admin" });

        db.Users.Add(testUser1);
        db.Users.Add(testUser2);
        db.Users.Add(testAdmin);

        db.Data.Add(testDatum1);
        db.Data.Add(testDatum2);
        db.Data.Add(testDatum3);
        
        db.SaveChanges();

        // Data in the Data table needs to be detached, otherwise the update won't work with unit tests
        foreach(var entry in db.Data.Local)
        {
            db.Entry(entry).State = EntityState.Detached;
        }
    }
}