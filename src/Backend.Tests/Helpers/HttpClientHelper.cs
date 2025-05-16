using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit.Abstractions;

namespace Backend.Tests.Helpers;

public class HttpClientHelper
{
    private readonly HttpClient _client;
    private readonly ITestOutputHelper _output;

    public HttpClientHelper(WebApplicationFactory<Program> factory, ITestOutputHelper output)
    {
        var clientOptions = new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        };

        _client = factory.CreateClient(clientOptions);
        _output = output;
    }

    // Overloading the CallEndpoint method allows easier usage than having a bunch of optional parameters
    // because that would require using named arguments.
    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, bool print = false)
    {
        return await CallEndpointImpl(url, method, null, null, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, object content, bool print = false)
    {
        return await CallEndpointImpl(url, method, content, null, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, string xcsrf, bool print = false)
    {
        return await CallEndpointImpl(url, method, null, xcsrf, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, object content, string xcsrf, bool print = false)
    {
        return await CallEndpointImpl(url, method, content, xcsrf, print);
    }

    public string? GetProperty(EndPointResponse response, string propertyname)
    {
        JsonElement property;

        if(!response.Content.TryGetProperty(propertyname, out property))
        {
            return null;
        }

        return property.GetString();
    }

    private async Task<EndPointResponse> CallEndpointImpl(string url, HttpMethod method, object? content, string? xcsrf, bool print)
    {
        var requestMessage = new HttpRequestMessage(method, url);

        // Set Accept header for consistent API interaction
        requestMessage.Headers.Accept.Clear();
        requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        if (content != null)
        {
            requestMessage.Content = new StringContent(JsonSerializer.Serialize(content), Encoding.UTF8, "application/json");
        }

        if (!string.IsNullOrEmpty(xcsrf))
        {
            requestMessage.Headers.Add("X-CSRF", xcsrf);
        }

        // Cookies are handled automatically by HttpClient's CookieContainer, only X-CSRF token needs to be set manually
        HttpResponseMessage response = await _client.SendAsync(requestMessage);

        var responseStr = await response.Content.ReadAsStringAsync();
        var responseContentElement = JsonSerializer.Deserialize<JsonElement>(string.IsNullOrEmpty(responseStr) ? "{}" : responseStr);

        List<string>? setCookieHeaders = null;
        if (response.Headers.TryGetValues("Set-Cookie", out IEnumerable<string>? cookies))
        {
            setCookieHeaders = cookies.ToList();
        }

        var result = new EndPointResponse
        {
            Url = url,
            Status = response.StatusCode,
            Content = responseContentElement,
            SetCookieHeaders = setCookieHeaders
        };

        if (print)
        {
            _output.WriteLine(result.ToString());
        }

        return result;
    }
}