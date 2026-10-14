namespace MarketPulse.API.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? IpAddress { get; set; }
        public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    }
}