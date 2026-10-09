namespace RentEase.API.DTOs
{
    public class ProfileDto
    {
        public string   Id                      { get; set; } = string.Empty;
        public string   FullName                { get; set; } = string.Empty;
        public string   Email                   { get; set; } = string.Empty;
        public string?  PhoneNumber             { get; set; }
        public int      EquipmentCount          { get; set; }
        public int      ActiveRentalsCount      { get; set; }
        public int      CompletedRentalsCount   { get; set; }
    }

    public class UpdateProfileDto
    {
        public string   FullName                { get; set; } = string.Empty;
        public string?  PhoneNumber             { get; set; }
    }

    public class ChangePasswordDto
    {
        public string   CurrentPassword         { get; set; } = string.Empty;
        public string   NewPassword             { get; set; } = string.Empty;
    }
}