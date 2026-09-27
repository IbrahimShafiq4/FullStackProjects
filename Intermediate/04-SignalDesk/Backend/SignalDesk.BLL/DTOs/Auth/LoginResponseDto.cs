namespace SignalDesk.BLL.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Message   { get; set; } = string.Empty;
        public string FullName  { get; set; } = string.Empty;
        public string Role      { get; set; } = string.Empty;
    }
}