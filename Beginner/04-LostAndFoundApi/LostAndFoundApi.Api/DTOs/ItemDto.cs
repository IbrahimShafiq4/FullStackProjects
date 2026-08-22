using Microsoft.AspNetCore.Mvc;

namespace LostAndFoundApi.Api.DTOs
{
    public class ItemDto
    {
        public int Id                       { get; set; }
        public string Title                 { get; set; } = string.Empty;
        public string Description           { get; set; } = string.Empty;
        public string Category              { get; set; } = string.Empty;
        public string? ImageUrl             { get; set; }
        public string Location              { get; set; } = string.Empty;
        public string Type                  { get; set; } = string.Empty;
        public string Status                { get; set; } = string.Empty;
        public DateTime CreatedAt           { get; set; }
        public string CreatedByDisplayName  { get; set; } = string.Empty;
    }
}
