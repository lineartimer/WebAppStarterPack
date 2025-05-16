using System.Net;
using Xunit.Abstractions;

using Backend.Tests.Helpers;

namespace Backend.Tests.IntegrationTests.Controllers;

public class AdminControllerTests : IClassFixture<WebAppStarterPackFactory<Program>>
{
    private readonly HttpClientHelper _client;

    public AdminControllerTests(WebAppStarterPackFactory<Program> factory, ITestOutputHelper output)
    {
        _client = new HttpClientHelper(factory, output);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithNoCookie_ForAdminUser()
    {
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, result.Status);
    }

    [Fact]
    public async Task UnauthorizedAccess_ShouldReturnUnauthorized_WithInvalidCookie_ForAdminUser()
    {
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, TestDataHelper.GetInvalidAuthCookie());
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

        // Try loading admin page
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, xcsrfAuthenticated, print: true);
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

        // Try loading admin page
        var result = await _client.CallEndpoint("/Admin", HttpMethod.Get, xcsrfAuthenticated, print: true);
        Assert.Equal(HttpStatusCode.OK, result.Status);

        var message = _client.GetProperty(result, "message");
        Assert.NotNull(message);
        Assert.True(message.Length > 0);
    }
}
