namespace PropVista.API.DTOs
{
    public class PropertyImageDto
    {
        public int                      Id              { get; set; }
        public string                   Url             { get; set; } = string.Empty;
        public bool                     IsCover         { get; set; }
    }

    public class PropertyDto
    {
        public int                      Id              { get; set; }
        public string                   Title           { get; set; } = string.Empty;
        public string                   Description     { get; set; } = string.Empty;
        public decimal                  Price           { get; set; }
        public string                   ListingType     { get; set; } = string.Empty;
        public string?                  TourVideoUrl    { get; set; }
        public string                   OwnerName       { get; set; } = string.Empty;
        public List<PropertyImageDto>   Images          { get; set; } = new();
    }

    public class CreatePropertyDto
    {
        public string                   Title           { get; set; } = string.Empty;
        public string                   Description     { get; set; } = string.Empty;
        public decimal                  Price           { get; set; }
        public string                   ListingType     { get; set; } = string.Empty;
    }

    public class ScheduleViewingDto { public DateTime ScheduledAt { get; set; } }
}
