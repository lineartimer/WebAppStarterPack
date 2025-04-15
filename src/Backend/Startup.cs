using Microsoft.EntityFrameworkCore;

using Backend.Data;

public class Startup
{
    private readonly IConfiguration _configuration;
    private string _policy = "policy";

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Configure services (dependency injection)
    public void ConfigureServices(IServiceCollection services)
    {
        AddCors(services);
        AddDbContext(services);

        services.AddControllers();
    }

    // Configure the HTTP request pipeline (middleware)
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(_policy);

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }

    private void AddCors(IServiceCollection services)
    {
        var origins = new string[] { "http://localhost", "https://localhost" };

        // Attempting to get the backend URL from environment variables (coming from GitHub secrets)
        var backendUrl = Environment.GetEnvironmentVariable("BACKEND_URL");
        if (backendUrl != null)
        {
            // If the backend URL is set, use it as the origin for CORS
            origins = new string[] { backendUrl };
        }

        services.AddCors(options =>
        {
            options.AddPolicy(_policy, builder => builder.WithOrigins(origins)
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
        });
    }

    private void AddDbContext(IServiceCollection services)
    {
        // Attempting to get the connection string from environment variables (coming from GitHub secrets)
        var dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
        var db = Environment.GetEnvironmentVariable("DB");
        var dbUser = Environment.GetEnvironmentVariable("DB_USER");
        var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

        string? connStr;
        var useSqlite = false;
        if (dbServer == null || db == null || dbUser == null || dbPassword == null)
        {
            // Locally environment variables are not set, so using the connection string stored in .Net Secrets Manager
            connStr = _configuration.GetConnectionString("SqlServer");

            if (connStr == null)
            {
                useSqlite = true;
                connStr = "Data Source=Local.db";
            }
        }
        else
        {
            connStr = $"Server={dbServer};Database={db};User Id={dbUser};Password={dbPassword};";
        }

        if (useSqlite)
        {
            // If there's no Ms Sql database, use local Sqlite database
            services.AddDbContext<DataContext>(options =>
                options.UseSqlite(connStr));
        }
        else
        {
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(connStr));
        }
    }
}