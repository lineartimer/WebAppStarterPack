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

        // Get X-CSRF token
        var xcsrfResponseAnonymous = await _client.CallEndpoint("/Auth/GetXcsrfToken", HttpMethod.Get, print: true);
        Assert.Equal(HttpStatusCode.OK, xcsrfResponseAnonymous.Status);
        string? xcsrfAnonymous = _client.GetProperty(xcsrfResponseAnonymous, "xcsrf");
        Assert.False(string.IsNullOrEmpty(xcsrfAnonymous));
        Assert.NotNull(xcsrfResponseAnonymous.SetCookieHeaders);
        Assert.Contains(xcsrfResponseAnonymous.SetCookieHeaders, h => h.StartsWith("XSRF="));

        // Log in
        var loginResponse = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto, xcsrfAnonymous, print: true);
        Assert.Equal(HttpStatusCode.OK, loginResponse.Status);
        Assert.NotNull(loginResponse.SetCookieHeaders);
        Assert.Contains(loginResponse.SetCookieHeaders, h => h.StartsWith("Auth="));

        // Get another X-CSRF token (we are now authenticated)
        var xcsrfResponseAuthenticated = await _client.CallEndpoint("/Auth/GetXcsrfToken", HttpMethod.Get, print: true);
        Assert.Equal(HttpStatusCode.OK, xcsrfResponseAuthenticated.Status);
        string? xcsrfAuthenticated = _client.GetProperty(xcsrfResponseAuthenticated, "xcsrf");
        Assert.False(string.IsNullOrEmpty(xcsrfAuthenticated));

        // Get data
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, xcsrfAuthenticated, print: true);
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

        // Get X-CSRF token
        var xcsrfResponseAnonymous = await _client.CallEndpoint("/Auth/GetXcsrfToken", HttpMethod.Get, print: true);
        Assert.Equal(HttpStatusCode.OK, xcsrfResponseAnonymous.Status);
        string? xcsrfAnonymous = _client.GetProperty(xcsrfResponseAnonymous, "xcsrf");
        Assert.False(string.IsNullOrEmpty(xcsrfAnonymous));
        Assert.NotNull(xcsrfResponseAnonymous.SetCookieHeaders);
        Assert.Contains(xcsrfResponseAnonymous.SetCookieHeaders, h => h.StartsWith("XSRF="));

        // Log in
        var loginResponse = await _client.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto, xcsrfAnonymous, print: true);
        Assert.Equal(HttpStatusCode.OK, loginResponse.Status);
        Assert.NotNull(loginResponse.SetCookieHeaders);
        Assert.Contains(loginResponse.SetCookieHeaders, h => h.StartsWith("Auth="));

        // Get another X-CSRF token (we are now authenticated)
        var xcsrfResponseAuthenticated = await _client.CallEndpoint("/Auth/GetXcsrfToken", HttpMethod.Get, print: true);
        Assert.Equal(HttpStatusCode.OK, xcsrfResponseAuthenticated.Status);
        string? xcsrfAuthenticated = _client.GetProperty(xcsrfResponseAuthenticated, "xcsrf");
        Assert.False(string.IsNullOrEmpty(xcsrfAuthenticated));

        // Get data
        var result = await _client.CallEndpoint("/Data", HttpMethod.Get, xcsrfAuthenticated, print: true);
        Assert.Equal(HttpStatusCode.OK, result.Status);
        Assert.True(result.Content.GetArrayLength() > 0);
    }
}