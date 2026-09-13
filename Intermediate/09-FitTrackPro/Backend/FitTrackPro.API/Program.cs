using Asp.Versioning;
using FitTrackPro.API.Data;
using FitTrackPro.API.Features;
using FitTrackPro.API.Mediator;
using FitTrackPro.API.Models;
using FitTrackPro.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ============================================================
// File Upload Limits
// ============================================================

const long maxRequestSize = 2L * 1024 * 1024 * 1024; // 2 GB

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = maxRequestSize;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = maxRequestSize;
});


// ============================================================
// Controllers
// ============================================================

builder.Services.AddControllers();


// ============================================================
// API Versioning
// ============================================================

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});


// ============================================================
// Swagger
// ============================================================

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FitTrackPro API",
        Version = "v1"
    });
});


// ============================================================
// Database
// ============================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// ============================================================
// Identity
// ============================================================

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<AppDbContext>();


// ============================================================
// Services
// ============================================================

builder.Services.AddScoped<IMediaStorageService, MediaStorageService>();
builder.Services.AddScoped<IMediator, SimpleMediator>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<
    IRequestHandler<LogWorkoutCommand, bool>,
    LogWorkoutHandler
>();
builder.Services.AddScoped<IRatingService, RatingService>();

// ============================================================
// Health Checks
// ============================================================

builder.Services
    .AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");


// ============================================================
// Rate Limiting
// ============================================================

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("workout-logging", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });

    options.RejectionStatusCode = 429;
});


// ============================================================
// Authentication / JWT
// ============================================================

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]!
                    )
                ),

            ValidateIssuer = false,
            ValidateAudience = false
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("authToken"))
                {
                    context.Token =
                        context.Request.Cookies["authToken"];
                }

                return Task.CompletedTask;
            }
        };
    });


// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// ============================================================
// Build
// ============================================================

var app = builder.Build();


// ============================================================
// Middleware
// ============================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");
app.Run();