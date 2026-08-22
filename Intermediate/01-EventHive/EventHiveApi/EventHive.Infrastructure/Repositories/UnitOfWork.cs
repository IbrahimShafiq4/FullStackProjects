using EventHive.Application.Interfaces;
using EventHive.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Infrastructure.Repositories
{
    public class UnitOfWork: IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IEventRepository? _eventRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IEventRepository EventsRepository => _eventRepository ??= new EventRepository(_context);

        public async Task<int> CompleteAsync() =>
            await _context.SaveChangesAsync();

        public void Dispose() =>
            _context.Dispose();

    }
}
