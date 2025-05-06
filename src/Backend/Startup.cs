using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Backend.Configurations;
using Backend.Data;

public class Startup
{
    private readonly IConfiguration _configuration;
    private string _policy = "policy";

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // Configure services (dependency injection)
        AddCors(services);
        AddDbContext(services);
        AddAuthentication(services);

        // Require authentiacation for all controllers by default
        services.AddControllers(options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));
                });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Configure the middleware pipeline
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(_policy);

        app.UseHttpsRedirection();
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }

    private void AddCors(IServiceCollection services)
    {
        var origins = new string[] {};

        // Attempting to get the backend URL from environment variables (coming from GitHub secrets)
        var backendUrl = Environment.GetEnvironmentVariable("BACKEND_URL");
        if (backendUrl == null)
        {
            // Development environment
            origins = ["https://localhost:3000"];
        }
        else
        {
            // Production environment
            origins = [backendUrl.Replace("backend", "frontend")];
        }

        services.AddCors(options =>
        {
            options.AddPolicy(_policy, builder => builder
                //.AllowAnyOrigin() // This is also an option, although not a very safe one
                .WithOrigins(origins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()); // Allow cookies
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
            // Locally, environment variables are not set, so using the connection string stored in .Net Secrets Manager
            connStr = _configuration.GetConnectionString("SqliteTestDb");

            if(connStr == null)
            {
                // Running locally
                connStr = _configuration.GetConnectionString("SqlServer");

                if (connStr == null)
                {
                    // No connection string is set in .Net Secrets Manager, so using the local Sqlite database
                    connStr = $"Data Source=Local.db";
                    useSqlite = true;
                }
            }
            else
            {
                // It's a test run
                useSqlite = true;
            }
        }
        else
        {
            // Running in the production environment
            connStr = $"Server={dbServer};Database={db};User Id={dbUser};Password={dbPassword};";
        }

        if (useSqlite)
        {
            // If there's no Ms Sql database, use local Sqlite database
            services.AddDbContext<DatabaseContext>(options =>
                options.UseSqlite(connStr));
        }
        else
        {
            services.AddDbContext<DatabaseContext>(options =>
                options.UseSqlServer(connStr));
        }
    }

    void AddAuthentication(IServiceCollection services)
    {
        // Get secret key from environment variables (coming from GitHub secrets)
        var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET");
        if (secretKey == null)
        {
            // If the secret key is not set, use the one stored in .Net Secrets Manager
            secretKey = _configuration["JWT_SECRET"];
            if (secretKey == null)
            {
                // If the secret key is not set in .Net Secrets Manager, create one for debugging purposes
                secretKey = "ThisNotSoSecretKeyIsForDebuggingPurposesOnly";
            }
        }

        var issuer = Environment.GetEnvironmentVariable("BACKEND_URL") ?? "localhost:5000";

        var jwtSettings = new JwtConfig
        {
            SecretKey = secretKey,
            Issuer = issuer,
            Audience = "backend"
        };
        services.AddSingleton(jwtSettings);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = jwtSettings.Issuer,
                            ValidAudience = jwtSettings.Audience,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
                        };

                        // Retrieving token from the cookie
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                Console.WriteLine("Cookies: " + string.Join(", ", context.Request.Cookies.Keys));
                                if (context.Request.Cookies.ContainsKey("AuthToken"))
                                {
                                    context.Token = context.Request.Cookies["AuthToken"];
                                    Console.WriteLine("Token retrieved from cookie: " + context.Token);
                                }

                                return Task.CompletedTask;
                            },
                            OnAuthenticationFailed = context =>
                            {
                                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = context =>
                            {
                                Console.WriteLine("Token validated successfully.");
                                return Task.CompletedTask;
                            }
                        };
                    });
    }
}