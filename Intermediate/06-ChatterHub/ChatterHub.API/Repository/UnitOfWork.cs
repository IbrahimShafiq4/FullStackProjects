using ChatterHub.API.Data;
using ChatterHub.API.Repositories;

namespace ChatterHub.API.Repository
{
    public interface IUnitOfWork 
    { 
        IRoomRepository     Rooms { get; } 
        IMessageRepository  Messages { get; } 
        Task<int>           SaveChangesAsync(); 
    }

    public class UnitOfWork: IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IRoomRepository      Rooms       { get; }
        public IMessageRepository   Messages    { get; }
        public UnitOfWork(AppDbContext context, IRoomRepository rooms, IMessageRepository messages)
        {
            _context = context;
            Rooms = rooms;
            Messages = messages;
        }

        public async Task<int> SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
