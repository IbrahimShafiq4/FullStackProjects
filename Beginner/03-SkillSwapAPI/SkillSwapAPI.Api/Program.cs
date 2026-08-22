using Microsoft.EntityFrameworkCore;
using SkillSwapAPI.Api.Data;
using SkillSwapAPI.Api.Profiles;

var builder = WebApplication.CreateBuilder(args);


// ======================================================
// Services
// ======================================================

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);

// AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500",
                           "http://localhost:5500",
                           "http://localhost:5075")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();


// ======================================================
// Middleware
// ======================================================

// Swagger

//app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseStaticFiles();

app.MapControllers();

app.Run();
