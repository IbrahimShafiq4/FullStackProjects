namespace RentEase.API.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class EquipmentDto 
    { 
        public int      Id          { get; set; } 
        public string   Name        { get; set; } = string.Empty; 
        public string   Category    { get; set; } = string.Empty; 
        public decimal  PricePerDay { get; set; } 
        public bool     IsAvailable { get; set; } 
        public string?  ImageUrl    { get; set; } 
        public string   OwnerName   { get; set; } = string.Empty; 
    }

    public class CreateEquipmentDto 
    { 
        public string    Name       { get; set; } = string.Empty; 
        public string   Category    { get; set; } = string.Empty; 
        public decimal  PricePerDay { get; set; } 
    }
    public class CreateBookingDto 
    { 
        public DateTime StartDate   { get; set; } 
        public DateTime EndDate     { get; set; }
    }
}
