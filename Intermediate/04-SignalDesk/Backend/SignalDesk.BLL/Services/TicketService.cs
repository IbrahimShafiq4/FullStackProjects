using SignalDesk.BLL.DTOs.Common;
using SignalDesk.BLL.DTOs.Tickets;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using SignalDesk.DAL.Models.Tickets;
using SignalDesk.DAL.Repositories;

namespace SignalDesk.BLL.Services
{
    public interface ITicketService
    {
        Task<TicketDto> CreateTicketAsync(string customerId, CreateTicketDto dto);
        Task<List<TicketDto>> GetTicketsAsync(string userId, UserRole role);
        Task<PagedResult<TicketDto>> GetFilteredAsync(string userId, UserRole role, TicketFilterDto filter);
        Task<TicketDto?> UpdateStatusAsync(int ticketId, string userId, UserRole role, UpdateTicketStatusDto dto);
        Task<TicketDto?> AssignAsync(int ticketId, string userId, UserRole role, AssignTicketDto dto);
        Task<TicketStatsDto> GetStatsAsync(string userId, UserRole role);
        Task<List<TicketNoteDto>> GetNotesAsync(int ticketId, string userId, UserRole role);
        Task<TicketNoteDto> AddNoteAsync(int ticketId, string authorId, CreateTicketNoteDto dto);
    }

    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _repo;
        private readonly ISlaCalculator _sla;

        public TicketService(ITicketRepository repo, ISlaCalculator sla)
        {
            _repo = repo;
            _sla = sla;
        }

        public async Task<TicketDto> CreateTicketAsync(string customerId, CreateTicketDto dto)
        {
            var createdAt = DateTime.UtcNow;

            var ticket = new Ticket
            {
                Subject = dto.Subject,
                Description = dto.Description,
                Priority = dto.Priority,
                Category = dto.Category,
                Tags = dto.Tags,
                CustomerId = customerId,
                CreatedAt = createdAt,
                SlaDeadline = _sla.CalculatedDeadline(dto.Priority, createdAt)
            };

            await _repo.AddTicketAsync(ticket);
            await _repo.SaveChangesAsync();

            var created = await _repo.GetByIdWithDetailsAsync(ticket.Id);

            return MapToDto(created!);
        }

        public async Task<List<TicketDto>> GetTicketsAsync(string userId, UserRole role)
        {
            var tickets = await _repo.GetAllForUserAsync(userId, role);

            return tickets
                .Select(MapToDto)
                .ToList();
        }

        public async Task<PagedResult<TicketDto>> GetFilteredAsync(
            string userId,
            UserRole role,
            TicketFilterDto filter)
        {
            var repositoryFilter = new TicketFilter
            {
                Search = filter.Search,
                Status = filter.Status,
                Priority = filter.Priority,
                Category = filter.Category,
                AssignedAgentId = filter.AssignedAgentId,
                AssignedToMe = filter.AssignedToMe,
                Unassigned = filter.Unassigned,
                Overdue = filter.Overdue,
                SortBy = filter.SortBy,
                SortDir = filter.SortDir,
                Page = filter.Page,
                PageSize = filter.PageSize
            };

            var (items, total) = await _repo.GetFilteredAsync(
                userId,
                role,
                repositoryFilter);

            return new PagedResult<TicketDto>
            {
                Items = items.Select(MapToDto).ToList(),
                TotalCount = total,
                Page = filter.Page < 1 ? 1 : filter.Page,
                PageSize = filter.PageSize < 1 ? 20 : Math.Min(filter.PageSize, 100)
            };
        }

        public async Task<TicketDto?> UpdateStatusAsync(
            int ticketId,
            string userId,
            UserRole role,
            UpdateTicketStatusDto dto)
        {
            var ticket = await _repo.GetByIdWithDetailsAsync(ticketId);

            if (ticket == null)
                return null;

            if (role == UserRole.Customer && ticket.CustomerId != userId)
                return null;

            if (ticket.Status == dto.Status)
                return MapToDto(ticket);

            var from = ticket.Status;

            ticket.Status = dto.Status;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == TicketStatus.Resolved && ticket.ResolvedAt == null)
                ticket.ResolvedAt = DateTime.UtcNow;

            await _repo.AddStatusHistoryAsync(new TicketStatusHistory
            {
                TicketId = ticketId,
                FromStatus = from,
                ToStatus = dto.Status,
                ChangedById = userId,
                ChangedAt = DateTime.UtcNow
            });

            await _repo.SaveChangesAsync();

            return MapToDto(ticket);
        }

        public async Task<TicketDto?> AssignAsync(
            int ticketId,
            string userId,
            UserRole role,
            AssignTicketDto dto)
        {
            if (role != UserRole.Agent)
                return null;

            var ticket = await _repo.GetByIdWithDetailsAsync(ticketId);

            if (ticket == null)
                return null;

            ticket.AssignedAgentId = string.IsNullOrEmpty(dto.AgentId)
                ? null
                : dto.AgentId;

            ticket.UpdatedAt = DateTime.UtcNow;

            if (ticket.Status == TicketStatus.Open &&
                !string.IsNullOrEmpty(dto.AgentId))
            {
                var from = ticket.Status;

                ticket.Status = TicketStatus.InProgress;

                await _repo.AddStatusHistoryAsync(new TicketStatusHistory
                {
                    TicketId = ticketId,
                    FromStatus = from,
                    ToStatus = TicketStatus.InProgress,
                    ChangedById = userId,
                    ChangedAt = DateTime.UtcNow
                });
            }

            await _repo.SaveChangesAsync();

            var updated = await _repo.GetByIdWithDetailsAsync(ticketId);

            return MapToDto(updated!);
        }

        public async Task<TicketStatsDto> GetStatsAsync(
            string userId,
            UserRole role)
        {
            var tickets = await _repo.GetAllForStatsAsync(userId, role);
            var now = DateTime.UtcNow;

            var resolved = tickets
                .Where(t => t.ResolvedAt.HasValue)
                .ToList();

            var avgHours = resolved.Any()
                ? resolved.Average(t =>
                    (t.ResolvedAt!.Value - t.CreatedAt).TotalHours)
                : 0;

            var slaEligible = tickets
                .Where(t =>
                    t.Status == TicketStatus.Resolved ||
                    t.Status == TicketStatus.Closed)
                .ToList();

            var slaOk = slaEligible.Count(t =>
                t.ResolvedAt.HasValue &&
                t.ResolvedAt <= t.SlaDeadline);

            var slaRate = slaEligible.Any()
                ? (double)slaOk / slaEligible.Count * 100
                : 0;

            var last7 = Enumerable.Range(0, 7)
                .Select(i => now.Date.AddDays(-6 + i))
                .Select(d => new DailyCountDto
                {
                    Date = d.ToString("yyyy-MM-dd"),
                    Created = tickets.Count(t => t.CreatedAt.Date == d),
                    Resolved = tickets.Count(t =>
                        t.ResolvedAt.HasValue &&
                        t.ResolvedAt.Value.Date == d)
                })
                .ToList();

            return new TicketStatsDto
            {
                Total = tickets.Count,
                Open = tickets.Count(t => t.Status == TicketStatus.Open),
                InProgress = tickets.Count(t => t.Status == TicketStatus.InProgress),
                Resolved = tickets.Count(t => t.Status == TicketStatus.Resolved),
                Closed = tickets.Count(t => t.Status == TicketStatus.Closed),
                Overdue = tickets.Count(t =>
                    _sla.IsOverdue(t.SlaDeadline) &&
                    t.Status != TicketStatus.Resolved &&
                    t.Status != TicketStatus.Closed),
                NearingDeadline = tickets.Count(t =>
                    _sla.IsNearingDeadline(t.SlaDeadline) &&
                    t.Status != TicketStatus.Resolved &&
                    t.Status != TicketStatus.Closed),
                Unassigned = tickets.Count(t =>
                    t.AssignedAgentId == null &&
                    t.Status != TicketStatus.Closed),
                AssignedToMe = tickets.Count(t =>
                    t.AssignedAgentId == userId),
                AvgResolutionHours = Math.Round(avgHours, 1),
                SlaComplianceRate = Math.Round(slaRate, 1),
                LastSevenDays = last7,
                ByCategory = tickets
                    .GroupBy(t => t.Category)
                    .Select(g => new CategoryCountDto
                    {
                        Category = g.Key.ToString(),
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Count)
                    .ToList(),
                ByPriority = tickets
                    .GroupBy(t => t.Priority)
                    .Select(g => new PriorityCountDto
                    {
                        Priority = g.Key.ToString(),
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Count)
                    .ToList()
            };
        }

        public async Task<List<TicketNoteDto>> GetNotesAsync(
            int ticketId,
            string userId,
            UserRole role)
        {
            var ticket = await _repo.GetByIdWithDetailsAsync(ticketId);

            if (ticket == null)
                return new();

            if (role == UserRole.Customer)
                return new();

            return ticket.Notes
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new TicketNoteDto
                {
                    Id = n.Id,
                    Content = n.Content,
                    CreatedAt = n.CreatedAt,
                    AuthorName = n.Author?.FullName ?? ""
                })
                .ToList();
        }

        public async Task<TicketNoteDto> AddNoteAsync(
            int ticketId,
            string authorId,
            CreateTicketNoteDto dto)
        {
            var note = new TicketNote
            {
                TicketId = ticketId,
                AuthorId = authorId,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddNoteAsync(note);
            await _repo.SaveChangesAsync();

            var ticket = await _repo.GetByIdWithDetailsAsync(ticketId);
            var saved = ticket!.Notes.First(n => n.Id == note.Id);

            return new TicketNoteDto
            {
                Id = saved.Id,
                Content = saved.Content,
                CreatedAt = saved.CreatedAt,
                AuthorName = saved.Author.FullName
            };
        }

        private TicketDto MapToDto(Ticket t)
        {
            return new TicketDto
            {
                Id = t.Id,
                Subject = t.Subject,
                Description = t.Description,
                Status = t.Status.ToString(),
                Priority = t.Priority.ToString(),
                Category = t.Category.ToString(),
                Tags = t.Tags,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                ResolvedAt = t.ResolvedAt,
                SlaDeadline = t.SlaDeadline,
                IsOverdue = _sla.IsOverdue(t.SlaDeadline) &&
                            t.Status != TicketStatus.Resolved &&
                            t.Status != TicketStatus.Closed,
                IsNearingDeadline = _sla.IsNearingDeadline(t.SlaDeadline) &&
                                    t.Status != TicketStatus.Resolved &&
                                    t.Status != TicketStatus.Closed,
                CustomerName = t.Customer?.FullName ?? "",
                AssignedAgentId = t.AssignedAgentId,
                AssignedAgentName = t.AssignedAgent?.FullName,
                MessageCount = t.Messages?.Count ?? 0,
                NoteCount = t.Notes?.Count ?? 0
            };
        }
    }
}