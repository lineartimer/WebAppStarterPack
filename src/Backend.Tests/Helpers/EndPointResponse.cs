using System.Net;
using System.Text.Json;

namespace Backend.Tests.Helpers;

public class EndPointResponse
{
    public string? Url { get; set; }

    public HttpStatusCode Status { get; set; }

    public JsonElement Content { get; set; }

    public string? AuthCookie { get; set; }

    public override string ToString()
    {
        return $"Url: {Url},{Environment.NewLine}Status: {Status},{Environment.NewLine}Content: {Content},{Environment.NewLine}Authentication cookie: {AuthCookie}";
    }
}
