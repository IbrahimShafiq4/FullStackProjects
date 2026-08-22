using EventHive.Application.Interfaces;
using EventHive.Domain.Entities;
using EventHive.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Infrastructure.Repositories
{
    public class EventRepository: IEventRepository
    {
        private AppDbContext    _context;
        private DbSet<Event>    _dbSet;
        private DbSet<Rsvp>     _Rsvps;
        public EventRepository(AppDbContext context)
        { _context = context; _dbSet = _context.Set<Event>(); _Rsvps = _context.Set<Rsvp>(); }

        // ================= READ =================
        public async Task<Event?> GetByIdAsync(int id) =>
             await _dbSet
                    .Include(e => e.Organizer)
                    .Include(e => e.Rsvps)
                    .ThenInclude(r => r.Attendee)
                    .FirstOrDefaultAsync(e => e.Id == id);

        public async Task<IEnumerable<Event>> GetAllAsync() =>
            await _dbSet
                    .Include(e => e.Organizer)
                    .Include(e => e.Rsvps)
                    .ThenInclude(r => r.Attendee)
                    .OrderByDescending(e => e.StartDate)
                    .ToListAsync();
    
        public async Task<IEnumerable<Event>> GetEventsByOrganizerAsync(string organizerId) =>
            await _dbSet
                    .Where(e => e.OrganizerId == organizerId)
                    .Include(e => e.Organizer)
                    .Include(e => e.Rsvps)
                    .ThenInclude(r => r.Attendee)
                    .OrderByDescending(e => e.StartDate)
                    .ToListAsync();

        public async Task<IEnumerable<Event>> GetUpcomingEventsAsync() =>
            await _dbSet
                    .Where(e => e.StartDate >= DateTime.UtcNow && e.IsActive)
                    .OrderBy(e => e.StartDate)
                    .Include(e => e.Organizer)
                    .Include(e => e.Rsvps)
                    .ThenInclude(r => r.Attendee)
                    .ToListAsync();
        

        // ================= WRITE =================
        public async Task AddAsync(Event eventEntity) =>
            await _dbSet.AddAsync(eventEntity);

        public void Update(Event eventEntity) =>
            _dbSet.Update(eventEntity);

        public void Delete(Event eventEntity) =>
            _dbSet.Remove(eventEntity);


        // ================= RSVP =================
        public async Task<int> GetRsvpCountAsync(int eventId) =>
            await _Rsvps.CountAsync(r => r.EventId == eventId && r.IsConfirmed);

        public async Task<bool> IsUserRsvpedAsync(int eventId, string userId) =>
            await _Rsvps.AnyAsync(r => r.EventId == eventId && r.AttendeeId == userId && r.IsConfirmed);

        public async Task<Rsvp?> GetRsvpAsync(int eventId, string userId) =>
            await _Rsvps.FirstOrDefaultAsync(r => r.EventId == eventId && r.AttendeeId == userId);

        public async Task AddRsvpAsync(Rsvp rsvp) =>
            await _Rsvps.AddAsync(rsvp);

        public async Task RemoveRsvpAsync(Rsvp rsvp)
        {
            _Rsvps.Remove(rsvp);
            await Task.CompletedTask;
        }

        public async Task<bool> SaveChangesAsync() =>
            await _context.SaveChangesAsync() > 0;
             
    }
}
