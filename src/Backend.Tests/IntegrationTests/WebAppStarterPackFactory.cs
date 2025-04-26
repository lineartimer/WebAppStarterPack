using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Backend.Tests.IntegrationTests;

public class WebAppStarterPackFactory<TEntryPoint> : WebApplicationFactory<TEntryPoint> where TEntryPoint : class
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
        // Set the SqlServer connection string to null so that the application uses the local Sqlite database
        builder.ConfigureHostConfiguration(config =>
        {
            var projectDirectory = Directory.GetParent(Environment.CurrentDirectory)?.Parent?.Parent?.FullName;
            
            var testConfig = new Dictionary<string, string?>
            {
                { "ConnectionStrings:SqliteTestDb", $"Data Source={projectDirectory}/Test.db" }
            };

            config.AddInMemoryCollection(testConfig);
        });

        return base.CreateHost(builder);
    }
}
