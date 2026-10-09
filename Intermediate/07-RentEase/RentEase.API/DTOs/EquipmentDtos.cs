namespace RentEase.API.DTOs
{
    public class UpdateEquipmentDto
    {
        public string   Name        { get; set; } = string.Empty;
        public string   Category    { get; set; } = string.Empty;
        public decimal  PricePerDay { get; set; }
    }

    public class UpdateAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}