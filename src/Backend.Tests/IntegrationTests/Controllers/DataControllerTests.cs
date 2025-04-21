using System.Net;
using Xunit.Abstractions;

using Backend.Tests.Helpers;

namespace Backend.Tests.IntegrationTests.Controllers;

public class DataControllerTests : IClassFixture<WebApplication1Factory<Program>>
{
    private readonly TestHelper _testHelper;

    public DataControllerTests(WebApplication1Factory<Program> factory, ITestOutputHelper output)
    {
        _testHelper = new TestHelper(factory, output);
    }

    [Fact]
    public async Task QueryingData_Works()
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
    }
}