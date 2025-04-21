using System.Net;
using Xunit.Abstractions;

using Backend.Tests.Helpers;

namespace Backend.Tests.IntegrationTests.Controllers;

public class AuthControllerTests : IClassFixture<WebApplication1Factory<Program>>
{
    private readonly TestHelper _testHelper;

    public AuthControllerTests(WebApplication1Factory<Program> factory, ITestOutputHelper output)
    {
        _testHelper = new TestHelper(factory, output);
    }

    [Fact]
    public async Task UnauthorizedAccess_Fails_ForCommonUser()
    {
        var noTokenResultCommon = await _testHelper.CallEndpoint("/Data", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, noTokenResultCommon.Status);

        var wrongTokenResultCommon = await _testHelper.CallEndpoint("/Data", HttpMethod.Get, "wrongtoken");
        Assert.Equal(HttpStatusCode.Unauthorized, wrongTokenResultCommon.Status);
    }

    [Fact]
    public async Task UnauthorizedAccess_Fails_ForAdminUser()
    {
        var noTokenResultAdmin = await _testHelper.CallEndpoint("/Admin", HttpMethod.Get);
        Assert.Equal(HttpStatusCode.Unauthorized, noTokenResultAdmin.Status);

        var wrongTokenResultAdmin = await _testHelper.CallEndpoint("/Admin", HttpMethod.Get, "wrongtoken");
        Assert.Equal(HttpStatusCode.Unauthorized, wrongTokenResultAdmin.Status);
    }

    [Fact]
    public async Task Login_Succeeds()
    {
        var loginDto = new
        {
            UserName = "user1",
            Password = "password1"
        };
        
        var response = await _testHelper.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        Assert.Equal(HttpStatusCode.OK, response.Status);
        
        var token = _testHelper.GetProperty(response, "token");
        Assert.NotNull(token);
    }

    [Fact]
    public async Task Login_Fails()
    {
        var loginDto = new
        {
            UserName = "invalidusername",
            Password = "wrongpassword"
        };
        
        var response = await _testHelper.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        Assert.Equal(HttpStatusCode.Unauthorized, response.Status);
        
        var token = _testHelper.GetProperty(response, "token");
        Assert.Null(token);
    }

    [Fact]
    public async Task Authorization_Works_ForCommonUser()
    {
        var loginDto = new
        {
            UserName = "user1",
            Password = "password1"
        };

        var response = await _testHelper.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        var token = _testHelper.GetProperty(response, "token");
        Assert.NotNull(token);

        var dataResult = await _testHelper.CallEndpoint("/Data", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, dataResult.Status);
        Assert.True(dataResult.Content.GetArrayLength() > 0);
        
        var adminResult = await _testHelper.CallEndpoint("/Admin", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.Forbidden, adminResult.Status);
        Assert.Equal(0, adminResult.Content.GetPropertyCount());
    }

    [Fact]
    public async Task Authorization_Works_ForAdmin()
    {
        var loginDto = new
        {
            UserName = "user3",
            Password = "password3"
        };
        
        var response = await _testHelper.CallEndpoint("/Auth/Login", HttpMethod.Post, loginDto);
        var token = _testHelper.GetProperty(response, "token");
        Assert.NotNull(token);

        var dataResult = await _testHelper.CallEndpoint("/Data", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, dataResult.Status);
        Assert.True(dataResult.Content.GetArrayLength() > 0);
        
        var adminResult = await _testHelper.CallEndpoint("/Admin", HttpMethod.Get, token);
        Assert.Equal(HttpStatusCode.OK, adminResult.Status);

        var message = _testHelper.GetProperty(adminResult, "message");
        Assert.NotNull(message);
        Assert.True(message.Length > 0);
    }
}
