using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SignalDesk.DAL.Repositories;

namespace SignalDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AgentsController : ControllerBase
    {
        private readonly ITicketRepository _repository;

        public AgentsController(ITicketRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAgents()
        {
            var agents = await _repository.GetAllAgentsAsync();
            return Ok(agents.Select(a => new { a.Id, a.FullName }));
        }
    }
}
