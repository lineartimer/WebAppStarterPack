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
        _client = factory.CreateClient();
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

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, string token, bool print = false)
    {
        return await CallEndpointImpl(url, method, null, token, print);
    }

    public async Task<EndPointResponse> CallEndpoint(string url, HttpMethod method, object content, string token, bool print = false)
    {
        return await CallEndpointImpl(url, method, content, token, print);
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

    private async Task<EndPointResponse> CallEndpointImpl(string url, HttpMethod method, object? content, string? token, bool print)
    {
        if (token == null)
        {
            _client.DefaultRequestHeaders.Authorization = null;
        }
        else
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        var contentStr = (content == null) ? null : new StringContent(JsonSerializer.Serialize(content), Encoding.UTF8, "application/json");

        HttpResponseMessage response;
        switch(method.Method)
        {
            case "GET":
                response = await _client.GetAsync(url);
                break;
            case "POST":
                response = await _client.PostAsync(url, contentStr);
                break;
            case "PUT":
                response = await _client.PutAsync(url, contentStr);
                break;
            case "DELETE":
                response = await _client.DeleteAsync(url);
                break;
            default:
                throw new Exception($"Only GET, POST, PUT and DELETE methods are supported.");
        }

        var responseStr = await response.Content.ReadAsStringAsync();
        var result = new EndPointResponse
        {
            Url = url,
            Status = response.StatusCode,
            Content = JsonSerializer.Deserialize<JsonElement>(string.IsNullOrEmpty(responseStr) ? "{}" : responseStr)
        };

        if (print)
        {
            _output.WriteLine(result.ToString());
        }
        
        return result;
    }
}