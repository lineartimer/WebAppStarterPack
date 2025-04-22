using System.Net;
using Xunit.Abstractions;

using Backend.Tests.Helpers;

namespace Backend.Tests.IntegrationTests.Controllers;

public class AdminControllerTests : IClassFixture<WebApplication1Factory<Program>>
{
    private readonly HttpClientHelper _client;

    public AdminControllerTests(WebApplication1Factory<Program> factory, ITestOutputHelper output)
    {
        _client = new HttpClientHelper(factory, output);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithNoToken_ForAdminUser()
    {
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithWrongToken_ForAdminUser()
    {
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, "wrongtoken");
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task Authorization_ShouldDenyAccess_ForCommonUser()
    {
        var loginDto = new
        {
            Username = "user1",
            Password = "password1"
        };

        var response = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        var token = _client.GetProperty(response, "token");
        Assert.NotNull(token);

        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.Forbidden, result.Status);
        Assert.Equal(0, result.Content.GetPropertyCount());
    }

    [Fact]
    public async Task Authorization_ShouldAllowAccess_ForAdminUser()
    {
        var loginDto = new
        {
            Username = "user3",
            Password = "password3"
        };
        
        var response = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        var token = _client.GetProperty(response, "token");
        Assert.NotNull(token);

        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, result.Status);

        var message = _client.GetProperty(result, "message");
        Assert.NotNull(message);
        Assert.True(message.Length > 0);
    }
}
