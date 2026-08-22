using AutoMapper;
using EventHive.Application.DTOs.Events;
using EventHive.Application.Interfaces;
using EventHive.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Services
{
    public class EventService
    {
        private readonly IUnitOfWork        _unitOfwork;
        private readonly IMapper            _mapper;
        private readonly IEventRepository   _Events;

        public EventService(IUnitOfWork unitOfWork, IMapper mapper)
        { _unitOfwork = unitOfWork; _mapper = mapper; _Events = _unitOfwork.EventsRepository; }

        // =================== GET ALL EVENTS ASYNC ===================
        public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
        {
            var events = await _Events.GetAllAsync();
            return _mapper.Map<IEnumerable<EventDto>>(events);
        }

        // =================== GET ALL SPEC EVENT ===================
        public async Task<EventDto?> GetEventByIdAsync(int id)
        {
            var eventEntity = await _Events.GetByIdAsync(id);
            return eventEntity == null ? null : _mapper.Map<EventDto>(eventEntity);
        }

        // =================== CREATE NEW EVENT ===================
        public async Task<EventDto> CreateEventAsync(CreateEventDto createDto, string organizerId)
        {
            var eventEntity         = _mapper.Map<Event>(createDto);
            eventEntity.OrganizerId = organizerId;
            eventEntity.CreatedAt   = DateTime.UtcNow;
            eventEntity.IsActive    = true;

            await _Events.AddAsync(eventEntity);
            await _unitOfwork.CompleteAsync();
            return _mapper.Map<EventDto>(eventEntity);
        }

        // =================== CREATE NEW EVENT ===================
        public async Task<EventDto?> UpdateEventAsync(int id, UpdateEventDto dto, string organzierId)
        {
            var eventEntity = await _Events.GetByIdAsync(id);
            if (eventEntity is null || eventEntity.OrganizerId != organzierId) return null;

            _mapper.Map(dto, eventEntity);
            
            _Events.Update(eventEntity);

            await _unitOfwork.CompleteAsync();

            return _mapper.Map<EventDto>(eventEntity);
        }

        // =================== DELETE AN EVENT ===================
        public async Task<bool> DeleteEventAsync(int id, string organizerId)
        {
            var eventEntity = await _Events.GetByIdAsync(id);
            if (eventEntity == null || eventEntity.OrganizerId != organizerId) return false;

            _Events.Delete(eventEntity);
            await _unitOfwork.CompleteAsync();
            return true;
        }

        // =================== RESERVE AN Event ===================
        public async Task<bool> RsvpToEventAsync(int eventId, string attendeeId)
        {
            var eventEntity = await _Events.GetByIdAsync(eventId);
            if (eventEntity == null || !eventEntity.IsActive) return false;

            if (eventEntity.OrganizerId == attendeeId) return false;

            var rsvpCount = await _Events.GetRsvpCountAsync(eventId);
            if (rsvpCount >= eventEntity.Capcity) return false;

            var existingRsvp = await _Events.GetRsvpAsync(eventId, attendeeId);

            if (existingRsvp != null) return false;

            var rsvp = new Rsvp
            {
                EventId     = eventId,
                AttendeeId  = attendeeId,
                CreatedAt   = DateTime.UtcNow,
                IsConfirmed = true
            };

            await _Events.AddRsvpAsync(rsvp);
            await _unitOfwork.CompleteAsync();
            return true;
        }

        // =================== Cancel A RESERVATION ===================
        public async Task<bool> CancelRsvp(int eventId, string attendeeId)
        {
            var rsvp = await _Events.GetRsvpAsync(eventId, attendeeId);
            if (rsvp is null) return false;

            await _Events.RemoveRsvpAsync(rsvp);
            await _unitOfwork.CompleteAsync();
            return true;
        }

        // =================== GET EVENTS BY ORGANIZER ===================
        public async Task<IEnumerable<EventDto>> GetEventsByOrganizerAsync(string organizerId)
        {
            var events = await _Events.GetEventsByOrganizerAsync(organizerId);

            return _mapper.Map<IEnumerable<EventDto>>(events);
        }

        // =================== GET UPCOMING EVENTS ===================
        public async Task<IEnumerable<EventDto>> GetUpcomingEventsAsync()
        {
            var events = await _Events.GetUpcomingEventsAsync();
            return _mapper.Map<IEnumerable<EventDto>>(events);
        }
    }
}
