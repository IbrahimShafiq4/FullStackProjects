using SignalDesk.DAL.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.Services
{
    public interface ISlaCalculator
    {
        DateTime    CalculatedDeadline  (TicketPriority priority, DateTime CreatedAt);
        bool        IsOverdue           (DateTime deadline);
        bool        IsNearingDeadline   (DateTime deadline);
    }

    public class SlaCalculator : ISlaCalculator
    {
        private static readonly Dictionary<TicketPriority, int> SlaHours = new()
        {
            [TicketPriority.Urget] = 2,
            [TicketPriority.High] = 8,
            [TicketPriority.Medium] = 24,
            [TicketPriority.Low] = 72,
        };

        public DateTime CalculatedDeadline(TicketPriority priority, DateTime CreatedAt)
        {
            return CreatedAt.AddHours(SlaHours[priority]);
        }

        public bool IsOverdue(DateTime deadline) => DateTime.UtcNow > deadline;

        public bool IsNearingDeadline(DateTime deadline)
        {
            var remining = deadline - DateTime.UtcNow;
            return remining.TotalHours > 0 && remining.TotalHours <= 2;
        }
    }
}
