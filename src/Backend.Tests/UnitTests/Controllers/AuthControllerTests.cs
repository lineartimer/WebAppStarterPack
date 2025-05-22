using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

using Backend.Configurations;
using Backend.Controllers;
using Backend.Data;
using Backend.Dtos;
using Backend.Tests.Helpers;

namespace Backend.Tests.UnitTests.Controllers;

public class AuthControllerTests
{
    private readonly DatabaseContext _db;
    private readonly JwtConfig _jwtConfig;
    private readonly Mock<IAntiforgery> _mockAntiforgery;

    public AuthControllerTests()
    {
        _db = DatabaseHelper.CreateInMemoryDatabaseContext();
        _jwtConfig = JwtHelper.JwtConfig;
        _mockAntiforgery = new Mock<IAntiforgery>();
    }

    [Fact]
    public void GetXcsrfToken_ShouldReturnOkResultWithToken()
    {
        var xcsrfToken = "ThisIsAnXCSRFTokenForTestingPurposesOnly";
        var xsrfCookie = "ThisIsAnXSRFCookieForTestingPurposesOnly";
        var headerName = "X-CSRF-Token";

        var tokenSet = new AntiforgeryTokenSet(xcsrfToken, xsrfCookie, headerName, null);

        _mockAntiforgery.Setup(af => af.GetAndStoreTokens(It.IsAny<HttpContext>()))
            .Returns(tokenSet);

        var controller = CreateAuthController();
        var response = controller.GetXcsrfToken();

        var result = Assert.IsType<OkObjectResult>(response);
        Assert.NotNull(result.Value);

        var xcsrfProperty = result.Value.GetType().GetProperty("Xcsrf");
        Assert.NotNull(xcsrfProperty);
        var xcsrfValue = xcsrfProperty.GetValue(result.Value)?.ToString();

        Assert.Equal(xcsrfToken, xcsrfValue);

        _mockAntiforgery.Verify(af => af.GetAndStoreTokens(controller.HttpContext), Times.Once);
    }

    [Fact]
    public async Task Login_ShouldReturnBadRequest_WithUsernameAndMissingPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Missing
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectBadRequestResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnBadRequest_WithMissingUsernameAndEmail()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectBadRequestResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnBadRequest_WithMissingUsernameAndEmailAndPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Missing
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectBadRequestResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithValidUsernameAndInvalidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Invalid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithValidEmailAndInvalidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Invalid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithValidUsernameAndEmailAndInvalidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Invalid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

   [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithInvalidUsernameAndValidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Invalid,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

   [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithInvalidEmailAndValidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Invalid,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

   [Fact]
    public async Task Login_ShouldReturnUnauthorized_WithInvalidUserNameAndEmailAndValidPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Invalid,
            Email = ParameterIntegrity.Invalid,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WithValidUsernameAndPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectOkResponse(credentialDto);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WithValidEmailAndPassword()
    {
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredential(credentialIntegrity);

        await LoginExcpectOkResponse(credentialDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithMissingUsername()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Valid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithMissingPassword()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Missing,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Valid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithMissingEmail()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Missing,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Valid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithMissingFirstName()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Missing,
            Role = ParameterIntegrity.Valid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithMissingRole()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Missing
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WithInvalidRole()
    {
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Invalid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectBadRequestResponse(userDto);
    }

    [Fact]
    public async Task SignUp_ShouldReturnOk_WithValidCredentials()
    {
        // Verify user doesn't exist
        var credentialIntegrity = new CredentialIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Missing,
            Password = ParameterIntegrity.Valid
        };

        var credentialDto = TestDataHelper.GetTestCredentialForSignUp(credentialIntegrity);

        await LoginExcpectUnauthorizedResponse(credentialDto);

        // Sign up user
        var userIntegrity = new UserIntegrity
        {
            Username = ParameterIntegrity.Valid,
            Password = ParameterIntegrity.Valid,
            Email = ParameterIntegrity.Valid,
            FirstName = ParameterIntegrity.Valid,
            Role = ParameterIntegrity.Valid
        };

        var userDto = TestDataHelper.GetTestUserForSignUp(userIntegrity, Role.User);

        await SignUpExcpectOkResponse(userDto);
        
        // Log in new user
        await LoginExcpectOkResponse(credentialDto);
    }
    
    private AuthController CreateAuthController()
    {
        var controller = new AuthController(_db, _jwtConfig, _mockAntiforgery.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        return controller;
    }

    private async Task LoginExcpectBadRequestResponse(CredentialDto credentialDto)
    {
        var auth = CreateAuthController();

        var response = await auth.Login(credentialDto);

        var result = Assert.IsType<BadRequestObjectResult>(response);
        Assert.NotNull(result.Value);
    }

    private async Task LoginExcpectUnauthorizedResponse(CredentialDto credentialDto)
    {
        var auth = CreateAuthController();
        
        var response = await auth.Login(credentialDto);

        var result = Assert.IsType<UnauthorizedObjectResult>(response);
        Assert.NotNull(result.Value);
    }

    private async Task LoginExcpectOkResponse(CredentialDto credentialDto)
    {
        var auth = CreateAuthController();
        
        var result = await auth.Login(credentialDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult);
        Assert.NotNull(okResult.Value);

        var roleProperty = okResult.Value.GetType().GetProperty("Role");
        Assert.NotNull(roleProperty);
        
        var roleValue = roleProperty.GetValue(okResult.Value)?.ToString();
        Assert.NotNull(roleValue);

        Assert.True(roleValue.Length > 0);
    }

    private async Task SignUpExcpectBadRequestResponse(UserDto userDto)
    {
        var auth = CreateAuthController();
        
        var response = await auth.SignUp(userDto);

        var result = Assert.IsType<BadRequestObjectResult>(response);
        Assert.NotNull(result.Value);
    }

    private async Task SignUpExcpectOkResponse(UserDto userDto)
    {
        var auth = CreateAuthController();
        
        var signUpResult = await auth.SignUp(userDto);
        Assert.IsType<OkResult>(signUpResult);
    }
}
