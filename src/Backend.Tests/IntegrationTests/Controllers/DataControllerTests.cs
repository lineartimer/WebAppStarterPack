using System.Net;
using Xunit.Abstractions;

using Backend.Tests.Helpers;

namespace Backend.Tests.IntegrationTests.Controllers;

public class DataControllerTests : IClassFixture<WebAppStarterPackFactory<Program>>
{
    private readonly HttpClientHelper _client;

    public DataControllerTests(WebAppStarterPackFactory<Program> factory, ITestOutputHelper output)
    {
        _client = new HttpClientHelper(factory, output);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithNoToken_ForCommonUser()
    {
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithWrongToken_ForCommonUser()
    {
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, "wrongtoken");
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task Authorization_ShouldAllowAccess_ForCommonUser()
    {
        var loginDto = new
        {
            Username = "user1",
            Password = "password1"
        };

        var response = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        var token = _client.GetProperty(response, "token");
        Assert.NotNull(token);

        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, result.Status);
        Assert.True(result.Content.GetArrayLength() > 0);
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

        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, result.Status);
        Assert.True(result.Content.GetArrayLength() > 0);
    }
}