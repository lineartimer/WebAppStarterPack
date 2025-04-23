using Backend.Configurations;

namespace Backend.Tests.Helpers;

public class JwtHelper
{
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