using Microsoft.AspNetCore.Mvc;

using Backend.Controllers;

namespace Backend.Tests.UnitTests.Controllers;

public class AdminControllerTests
{
    [Fact]
    public void GetAdminData_ShouldReturnOk_ForAuthorizedUser()
    {
        var controller = new AdminController();

        var result = controller.GetAdminData();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var messageProperty = okResult.Value.GetType().GetProperty("Message");
        Assert.NotNull(messageProperty);

        var messageValue = messageProperty.GetValue(okResult.Value)?.ToString();
        Assert.NotNull(messageValue);
        Assert.Equal("This is only for admins.", messageValue);
    }
}