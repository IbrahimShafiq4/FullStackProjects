using ChatterHub.API.DTOs;
using ChatterHub.API.Models;
using ChatterHub.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatterHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoomsController(IUnitOfWork unitOfWork)
        { _unitOfWork = unitOfWork; }

        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _unitOfWork.Rooms.GetAllWithMessagesAsync();
            return Ok(rooms.Select(r => new RoomDto(
                r.Id, r.Name, r.Topic, r.LastActivityAt, r.Messages.Count)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomDetails(int id)
        {
            var room = await _unitOfWork.Rooms.GetByIdWithMessagesAsync(id);
            if (room is null) return NotFound();

            var dto = new
            {
                room.Id,
                room.Name,
                room.Topic,
                room.CreatedAt,
                Messages = room.Messages.Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.SentAt,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.FullName,
                    AttachmentUrl = (string?)null
                })
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom(CreateRoomRequest req)
        {
            var room = new Room { Name = req.Name, Topic = req.Topic };
            await _unitOfWork.Rooms.AddAsync(room);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { room.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _unitOfWork.Rooms.GetByIdAsync(id) as Room;
            if (room is null) return NotFound();
            await _unitOfWork.Rooms.DeleteAsync(room);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { message = "تم حذف الغرفة بنجاح" });
        }
    }
}
