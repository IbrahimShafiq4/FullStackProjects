using System.Net;
using System.Text.Json;

namespace MarketPulse.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception at {Path}", ctx.Request.Path);

            ctx.Response.Clear();
            ctx.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            ctx.Response.ContentType = "application/problem+json";

            var payload = new
            {
                type = "https://httpstatuses.com/500",
                title = "حدث خطأ غير متوقع",
                status = 500,
                detail = _env.IsDevelopment() ? ex.Message : "يرجى المحاولة مرة أخرى لاحقًا.",
                traceId = ctx.TraceIdentifier
            };

            await ctx.Response.WriteAsync(JsonSerializer.Serialize(payload));
        }
    }
}