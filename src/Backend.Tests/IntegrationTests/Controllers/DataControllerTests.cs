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
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithNoCookie_ForCommonUser()
    {
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithInvalidCookie_ForCommonUser()
    {
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, TestDataHelper.GetInvalidAuthCookie());
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

        var loginResponse = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        Assert.NotNull(loginResponse.AuthCookie);
        Assert.NotEqual(string.Empty, loginResponse.AuthCookie);

        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, loginResponse.AuthCookie);
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
        
        var loginResponse = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        Assert.NotNull(loginResponse.AuthCookie);
        Assert.NotEqual(string.Empty, loginResponse.AuthCookie);

        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, loginResponse.AuthCookie);
        Assert.Equal(HttpStatusCode.OK, result.Status);
        Assert.True(result.Content.GetArrayLength() > 0);
    }
}