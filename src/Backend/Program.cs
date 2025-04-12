var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
var db = Environment.GetEnvironmentVariable("DB");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

app.MapGet("/", () => $"The environment variables are: {dbServer}, {db}, {dbUser}, and {dbPassword}");

app.Run();
