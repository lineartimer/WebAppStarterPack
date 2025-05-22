using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Backend.Configurations;
using Backend.Data;
using Backend.Filters;

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

        // Suppress EF Core query logs
        services.AddLogging(builder =>
        {
            builder.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Warning);
        });

        // Require authentiacation for all controllers by default
        services.AddControllers(options =>
                {
                    var policy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                    options.Filters.Add(new AuthorizeFilter(policy));

                    // Automatically validate antiforgery tokens for unsafe HTTP methods like POST, PUT and DELETE but
                    // skip validation for GET methods.
                    options.Filters.Add(new ApiValidateAntiForgeryToken());
                });

        // In Azure, there's a reverse proxy or load balancer (ingress controller) in front of the Container App, which
        // handles the incoming HTTPS traffic from the internet. The Azure infrastructure terminates
        // the SSL connection (decrypts the traffic) then forwards the request to the Container App.
        // This forwarded request is often plain HTTP. So, the backend sees an HTTP request,
        // even though the original request from the frontend was HTTPS. The proxy adds headers like
        // X-Forwarded-Proto (to indicate the original protocol, e.g., "https") and
        // X-Forwarded-For (to indicate the original client IP). The Forwarded Headers middleware reads these headers
        // and updates the HttpContext.Request object so that your application behaves as if it received the original HTTPS request.
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Needs to be added early in the pipeline
        app.UseForwardedHeaders();

        // Configure the middleware pipeline
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(_policy);

        app.UseHttpsRedirection();
        //app.UseStaticFiles(); // This would allow the backend to serve static files like html, css, js etc.
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization(); // Antiforgery system relies on HttpContext.Request.Scheme being correct

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }

    private void AddCors(IServiceCollection services)
    {
        var origins = new List<string>();

        // Attempting to get the backend URL from environment variables (coming from GitHub secrets)
        var backendUrl = Environment.GetEnvironmentVariable("BACKEND_URL");
        if (backendUrl == null)
        {
            // Development environment
            origins.Add("https://localhost:3000");
        }
        else
        {
            // Production environment
            var frontendUrl = backendUrl.TrimEnd('/').Replace("backend", "frontend");
            origins.Add(frontendUrl);

            Console.WriteLine($"Allowed CORS origin: {frontendUrl}");
        }

        services.AddCors(options =>
        {
            options.AddPolicy(_policy, builder => builder
                //.AllowAnyOrigin() // This is also an option, although not a very safe one
                .WithOrigins(origins.ToArray())
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

            if (connStr == null)
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

        var issuer = Environment.GetEnvironmentVariable("BACKEND_URL") ?? "https://localhost:5000";

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
                                if (context.Request.Cookies.ContainsKey("Auth"))
                                {
                                    context.Token = context.Request.Cookies["Auth"];
                                }

                                return Task.CompletedTask;
                            },
                            OnAuthenticationFailed = context =>
                            {
                                Console.WriteLine("Authentication failed: " + context.Exception.Message);

                                return Task.CompletedTask;
                            }
                        };
                    });

        services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-CSRF"; // Request token
                options.Cookie.Name = "XSRF"; // Cookie token
                options.Cookie.HttpOnly = false;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                // This will work even though the frontend and the backend have different urls
                // because azurecontainerapps.io is on the public suffix list
                options.Cookie.SameSite = SameSiteMode.Strict;
            });
    }
}