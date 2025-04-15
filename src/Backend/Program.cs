using Microsoft.EntityFrameworkCore;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

var origins = "localhostPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(origins, builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// Attempting to get the connection string from environment variables (coming from GitHub Secrets)
var dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
var db = Environment.GetEnvironmentVariable("DB");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

string? connStr;
if (string.IsNullOrEmpty(dbServer) || string.IsNullOrEmpty(db) || string.IsNullOrEmpty(dbUser) || string.IsNullOrEmpty(dbPassword))
{
    // Locally: environment variables are not set, so using the connection string stored in .Net Secrets Manager
    connStr = builder.Configuration.GetConnectionString("SqlServer");

    if (connStr == null)
    {
        // If there's no Ms Sql database, use local Sqlite database
        builder.Services.AddDbContext<DataContext>(options =>
            options.UseSqlite("Data Source=Local.db"));
    }
    else
    {
        builder.Services.AddDbContext<DataContext>(options =>
            options.UseSqlServer(connStr));
    }
}
else
{
    connStr = $"Server={dbServer};Database={db};User Id={dbUser};Password={dbPassword};";
}

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(origins);

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
