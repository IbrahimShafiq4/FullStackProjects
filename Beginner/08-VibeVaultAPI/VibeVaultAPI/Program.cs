using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VibeVaultAPI.Data;
using VibeVaultAPI.Mappings;
using VibeVaultAPI.Models;
using VibeVaultAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// ==================================================
// Controllers
// ==================================================

builder.Services.AddControllers();


// ==================================================
// Swagger
// ==================================================

builder.Services.AddSwaggerGen();


// ==================================================
// Database
// ==================================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});


// ==================================================
// Identity
// ==================================================

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();


// ==================================================
// Custom Services
// ==================================================

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();


// ==================================================
// AutoMapper
// ==================================================

builder.Services.AddAutoMapper(
    cfg => { },
    typeof(MappingProfile)
);


// ==================================================
// JWT Configuration
// ==================================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key is missing. Please configure 'Jwt:Key' using User Secrets."
    );
}


// ==================================================
// Authentication
// ==================================================

builder.Services.AddAuthentication(options =>
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

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        ),

        ValidateIssuer = false,
        ValidateAudience = false,

        ValidateLifetime = true,

        ClockSkew = TimeSpan.Zero
    };

    // Read JWT from HttpOnly Cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.TryGetValue(
                "authToken",
                out var token))
            {
                context.Token = token;
            }

            return Task.CompletedTask;
        }
    };
});


// ==================================================
// CORS
// ==================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

// ⭐ لازم CORS هنا
app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();