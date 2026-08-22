using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using System.Reflection;
using VideoPlatformApi.Api.Data;
using VideoPlatformApi.Api.Hubs;
using VideoPlatformApi.Api.Profiles;
using VideoPlatformApi.Api.Repositories.LikeRepo;
using VideoPlatformApi.Api.Repositories.UserRepo;
using VideoPlatformApi.Api.Repositories.VideoRepo;
using VideoPlatformApi.Api.Services;
using VideoPlatformApi.Api.Services.CommentServiceControl;
using VideoPlatformApi.Api.Services.FileServiceControl;
using VideoPlatformApi.Api.Services.LIkeServiceControl;
using VideoPlatformApi.Api.Services.UserServiceControl;
using VideoPlatformApi.Api.Services.VideoServiceControl;
using VideoPlatformApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo
    {
        Title = "Video Platform API",
        Version = "v1",
        Description = "منصة مشاركة الفيديوهات - API",
        Contact = new Microsoft.OpenApi.OpenApiContact
        {
            Name = "TaskFlow Team",
            Email = "support@taskflow.com"
        }
    });
});

builder.Services.AddSignalR();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddAutoMapper(typeof(VideoProfile));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5115", "https://localhost:7165")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

builder.Services.AddScoped<IVideoRepository, VideoRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ILikeRepository, LikeRepository>();

builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<ILikeService, LikeService>();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Video Platform API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();

app.UseCors("AllowFrontend");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<VideoHub>("/videoHub");

app.Run();