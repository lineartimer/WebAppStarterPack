using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Xunit.Abstractions;

using Backend.Configurations;
using Backend.Data;
using Backend.Models;

namespace Backend.Tests.Helpers;

public class TestHelper
{
    private readonly HttpClient _client;
    private readonly ITestOutputHelper _output;
    
    public TestHelper(WebApplicationFactory<Program> factory, ITestOutputHelper output)
    {
        _client = factory.CreateClient();
        _output = output;
    }
        
    public static DatabaseContext InMemoryDatabaseContext { get; } = CreateInMemoryDatabaseContext();

    public static JwtConfig JwtConfig { get; } = CreateJwtConfig();

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, bool print = false)
    {
        return await CallEndpointImpl(url, method, null, null, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, object content, bool print = false)
    {
        return await CallEndpointImpl(url, method, content, null, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, string token, bool print = false)
    {
        return await CallEndpointImpl(url, method, null, token, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, object content, string token, bool print = false)
    {
        return await CallEndpointImpl(url, method, content, token, print);
    }
    
    public string? GetProperty(EndPointResponse response, string propertyname)
    {
        JsonElement property;

        if(!response.Content.TryGetProperty(propertyname, out property))
        {
            return null;
        }

        return property.GetString();
    }

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
            UserName = "testuser1",
            Email = "testuser1@gmail.com",
            FirstName = "testfirstname1",
        };

        testUser.Password = pwdHasher.HashPassword(testUser, "testpassword1");

        var testAdmin = new User
        {
            Id = 2,
            RoleId = 2,
            UserName = "testadmin1",
            Email = "testadmin1@gmail.com",
            FirstName = "testfirstname2",
        };

        testAdmin.Password = pwdHasher.HashPassword(testAdmin, "testpassword2");

        db.Roles.Add(new Role { Id = 1, Name = "User" });
        db.Roles.Add(new Role { Id = 2, Name = "Admin" });

        db.Users.Add(testUser);
        db.Users.Add(testAdmin);

        db.SaveChanges();

        return db;
    }

    private static JwtConfig CreateJwtConfig()
    {
        return new JwtConfig
            {
                SecretKey = "ThisNotSoSecretKeyIsForTestingPurposesOnly",
                Issuer = "localhost",
                Audience = "backend"
            };
    }

    private async Task<EndPointResponse> CallEndpointImpl(string url, HttpMethod method, object? content, string? token, bool print)
    {
        if (token == null)
        {
            _client.DefaultRequestHeaders.Authorization = null;
        }
        else
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        var contentStr = (content == null) ? null : new StringContent(JsonSerializer.Serialize(content), Encoding.UTF8, "application/json");

        HttpResponseMessage response;
        switch(method.Method)
        {
            case "GET":
                response = await _client.GetAsync(url);
                break;
            case "POST":
                response = await _client.PostAsync(url, contentStr);
                break;
            case "PUT":
                response = await _client.PutAsync(url, contentStr);
                break;
            case "DELETE":
                response = await _client.DeleteAsync(url);
                break;
            default:
                throw new Exception($"Only GET, POST, PUT and DELETE methods are supported.");
        }

        var responseStr = await response.Content.ReadAsStringAsync();
        var result = new EndPointResponse
        {
            Url = url,
            Status = response.StatusCode,
            Content = JsonSerializer.Deserialize<JsonElement>(string.IsNullOrEmpty(responseStr) ? "{}" : responseStr)
        };

        if (print)
        {
            _output.WriteLine(result.ToString());
        }
        
        return result;
    }
}