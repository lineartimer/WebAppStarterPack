using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Filters;

public class ApiValidateAntiForgeryToken : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Skip antiforgery validation if the action or its controller has the ignore attribute
        var endpoint = context.HttpContext.GetEndpoint();
        if (endpoint?.Metadata.GetMetadata<AllowNoAntiforgeryToken>() != null)
        {
            await next();
            return;
        }
        
        var antiforgery = context.HttpContext.RequestServices.GetService<IAntiforgery>();
        if (antiforgery == null)
        {
            throw new InvalidOperationException("Anti-forgery service not registered.");
        }

        try
        {
            await antiforgery.ValidateRequestAsync(context.HttpContext);
            await next();
        }
        catch (AntiforgeryValidationException e)
        {
            var errorMessage = $"Debug Message {DateTime.Now}: Anti-forgery error at {context.HttpContext.Request.Path}{context.HttpContext.Request.QueryString}. {e.Message}";
            context.Result = new BadRequestObjectResult(new
            {
                ErrorMessage = errorMessage
            });

            Console.WriteLine(errorMessage);
        }
    }
}
