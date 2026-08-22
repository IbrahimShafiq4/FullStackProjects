namespace NoteVaultAPI.DTOs.NoteDto
{
    public class NoteDto
    {
        public int Id               { get; set; }
        public string Title         { get; set; } = string.Empty;
        public string Content       { get; set; } = string.Empty;
        public DateTime CreatedAt   { get; set; }
    }
}
