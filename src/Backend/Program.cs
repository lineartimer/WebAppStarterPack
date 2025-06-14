// Main entry point of the application
var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, app.Environment, app.Lifetime);

app.Run();

// This declaration is required for integration tests to work
public partial class Program { }
