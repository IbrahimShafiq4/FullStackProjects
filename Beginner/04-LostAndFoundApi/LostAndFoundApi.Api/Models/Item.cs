namespace LostAndFoundApi.Api.Models
{
    public class Item
    {
        public int Id                       { get; set; }
        public string Title                 { get; set; } = string.Empty;
        public string Description           { get; set; } = string.Empty;
        public string Category              { get; set; } = string.Empty;
        public string? ImageUrl             { get; set; } = string.Empty;
        public string Location              { get; set; } = string.Empty;

        public ItemType Type                { get; set; }
        public ItemStatus Status            { get; set; } = ItemStatus.Open;

        public DateTime CreatedAt           { get; set; } = DateTime.UtcNow;
        public string CreatedByUserId       { get; set; } = string.Empty;
        public AppUser CreatedByUser        { get; set; } = null!;

        public int? MatchedWithItemId       { get; set; }
        public Item? MatchedWithItem        { get; set; }
    }
}
