using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using R_FIT.Application.Interfaces;
using R_FIT.Infrastructure.Hubs;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly IAppDbContext                  _context;
        private readonly IHubContext<NotificationHub>   _hubContext;
        public CommentsController(IAppDbContext context, IHubContext<NotificationHub> hubContext)
        { _context = context; _hubContext = hubContext; }
    }
}
