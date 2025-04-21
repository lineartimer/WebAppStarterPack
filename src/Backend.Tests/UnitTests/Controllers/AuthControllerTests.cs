using Microsoft.AspNetCore.Mvc;

using Backend.Controllers;
using Backend.Dtos;
using Backend.Tests.Helpers;

namespace Backend.Tests.UnitTests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_ReturnsOk_WithValidCredentials()
    {
        var auth = new AuthController(TestHelper.InMemoryDatabaseContext, TestHelper.JwtConfig);

        var loginDto = new LoginDto
        {
            UserName = "testuser1",
            Password = "testpassword1"
        };
        
        var result = await auth.Login(loginDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WithInvalidCredentials()
    {
        var controller = new AuthController(TestHelper.InMemoryDatabaseContext, TestHelper.JwtConfig);

        var loginDto = new LoginDto
        {
            UserName = "invaliduser",
            Password = "wrongpassword"
        };
        
        var result = await controller.Login(loginDto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
