using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading.Tasks;

namespace Backend.Filters
{
    public class ApiValidateAntiForgeryTokenAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
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
                context.Result = new BadRequestObjectResult("Invalid anti-forgery token: " + e.Message);
            }
        }
    }
}