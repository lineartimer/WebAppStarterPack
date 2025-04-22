using Microsoft.AspNetCore.Mvc;

using Backend.Controllers;
using Backend.Dtos;
using Backend.Tests.Helpers;

namespace Backend.Tests.UnitTests.Controllers;

public class AuthControllerTests
{
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

    private async Task LoginExcpectBadRequestResponse(CredentialDto credentialDto)
    {
        var auth = new AuthController(DatabaseHelper.InMemoryDatabaseContext, JwtHelper.JwtConfig);
        
        var response = await auth.Login(credentialDto);

        var result = Assert.IsType<BadRequestObjectResult>(response);
        Assert.NotNull(result.Value);

        var tokenProperty = result.Value.GetType().GetProperty("Token");
        Assert.Null(tokenProperty);
    }

    private async Task LoginExcpectUnauthorizedResponse(CredentialDto credentialDto)
    {
        var auth = new AuthController(DatabaseHelper.InMemoryDatabaseContext, JwtHelper.JwtConfig);
        
        var response = await auth.Login(credentialDto);

        var result = Assert.IsType<UnauthorizedObjectResult>(response);
        Assert.NotNull(result.Value);

        var tokenProperty = result.Value.GetType().GetProperty("Token");
        Assert.Null(tokenProperty);
    }

    private async Task LoginExcpectOkResponse(CredentialDto credentialDto)
    {
        var auth = new AuthController(DatabaseHelper.InMemoryDatabaseContext, JwtHelper.JwtConfig);
        
        var result = await auth.Login(credentialDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var tokenProperty = okResult.Value.GetType().GetProperty("Token");
        Assert.NotNull(tokenProperty);

        var tokenValue = tokenProperty.GetValue(okResult.Value)?.ToString();
        Assert.NotNull(tokenValue);

        Assert.True(tokenValue.Length > credentialDto.Password.Length);
    }

    private async Task SignUpExcpectBadRequestResponse(UserDto userDto)
    {
        var auth = new AuthController(DatabaseHelper.InMemoryDatabaseContext, JwtHelper.JwtConfig);
        
        var response = await auth.SignUp(userDto);

        var result = Assert.IsType<BadRequestObjectResult>(response);
        Assert.NotNull(result.Value);
    }

    private async Task SignUpExcpectOkResponse(UserDto userDto)
    {
        var auth = new AuthController(DatabaseHelper.InMemoryDatabaseContext, JwtHelper.JwtConfig);
        
        var signUpResult = await auth.SignUp(userDto);
        Assert.IsType<OkResult>(signUpResult);
    }
}
