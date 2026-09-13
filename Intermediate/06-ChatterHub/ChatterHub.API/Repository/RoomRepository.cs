using ChatterHub.API.Data;
using ChatterHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatterHub.API.Repositories
{
    public interface IRoomRepository
    {
        Task<List<Room>>    GetAllAsync();
        Task<Room?>         GetByIdAsync(int id);
        Task                AddAsync(Room room);
        Task                DeleteAsync(Room room);
        Task<Room?> GetByIdWithMessagesAsync(int id);
    }

    public class RoomRepository: IRoomRepository
    {
        private readonly AppDbContext   _context;
        private readonly DbSet<Room>    _Room;
        public RoomRepository(AppDbContext context) { _context = context; _Room = _context.Set<Room>(); }

        public async Task<List<Room>> GetAllAsync() =>
            await _Room.OrderByDescending(r => r.LastActivityAt).ToListAsync();

        public async Task<Room?> GetByIdAsync(int id) => 
            await _context.Rooms
                            .Include
                            (
                                r => r.Messages
                                      .OrderByDescending(m => m.SentAt)
                                      .Take(50)
                            )
                            .ThenInclude(m => m.Sender)
                            .FirstOrDefaultAsync(r => r.Id == id);

        public async Task AddAsync(Room room) =>
            await _Room.AddAsync(room);

        public async Task DeleteAsync(Room room)
        {
            _Room.Remove(room);
            await Task.CompletedTask;
        }

        public async Task<Room?> GetByIdWithMessagesAsync(int id)
        {
            return await _context.Rooms
                .Include(r => r.Messages)
                .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
