using System.Net;
using System.Text;
using System.Text.Json;

namespace Backend.Tests.Helpers;

public class EndPointResponse
{
    public string? Url { get; set; }

    public HttpStatusCode Status { get; set; }

    public List<string>? SetCookieHeaders { get; set; }

    public JsonElement Content { get; set; }

    public override string ToString()   
    {
        var setCookieHeaders = new StringBuilder();
        if (SetCookieHeaders != null)
        {
            foreach (var setCookieHeader in SetCookieHeaders)
            {
                setCookieHeaders.Append($"{setCookieHeader} ");
            }
        }

        return $"Url: {Url},{Environment.NewLine}Status: {Status},{Environment.NewLine}Content: {Content},{Environment.NewLine}Set-Cookies: {setCookieHeaders.ToString()}";
    }
}
