using Microsoft.AspNetCore.Mvc.Testing;
using Backend.Configurations;

namespace Backend.Tests.Helpers;

public class JwtHelper
{
    public JwtHelper(WebApplicationFactory<Program> factory)
    {
        
    }

    public static JwtConfig JwtConfig { get; } = CreateJwtConfig();

    private static JwtConfig CreateJwtConfig()
    {
        return new JwtConfig
            {
                SecretKey = "ThisNotSoSecretKeyIsForTestingPurposesOnly",
                Issuer = "localhost",
                Audience = "backend"
            };
    }
}