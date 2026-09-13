using ChatterHub.API.Data;
using ChatterHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatterHub.API.Repository
{
    public interface IMessageRepository { Task AddAsync(RoomMessage message); }
    public class MessageRepository: IMessageRepository
    {
        private readonly AppDbContext       _context;
        private readonly DbSet<RoomMessage> _RoomMessage;

        public MessageRepository(AppDbContext context)
        { _context = context; _RoomMessage = _context.Set<RoomMessage>(); }

        public async Task AddAsync(RoomMessage message) =>
            await _RoomMessage.AddAsync(message);
    }
}
