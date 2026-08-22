using EventHive.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Interfaces
{
    public interface IEventRepository
    {
        // === READ ===
        Task<Event?>                GetByIdAsync(int id);
        Task<IEnumerable<Event>>    GetAllAsync();
        Task<IEnumerable<Event>>    GetEventsByOrganizerAsync(string organizerId);
        Task<IEnumerable<Event>>    GetUpcomingEventsAsync();

        // === WRITE ===
        Task                        AddAsync(Event eventEntity);
        void                        Update(Event eventEntity);
        void                        Delete(Event eventEntity);

        // === RSVP OPERATIONS ===
        // === RSVP Read ===
        Task<int>                   GetRsvpCountAsync(int eventId);
        Task<bool>                  IsUserRsvpedAsync(int eventId, string userId);
        Task<Rsvp?>                 GetRsvpAsync(int eventId, string userId);
        // === RSVP Write ===
        Task                        AddRsvpAsync(Rsvp rsvp);
        Task                        RemoveRsvpAsync(Rsvp rsvp);
        // === SaveChanges in the Db
        Task<bool>                  SaveChangesAsync();
    }
}
