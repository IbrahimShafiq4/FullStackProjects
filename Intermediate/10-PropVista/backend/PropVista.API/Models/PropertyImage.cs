namespace PropVista.API.Models
{
    public class PropertyImage
    {
        public int          Id          { get; set; }
        public string       Url         { get; set; } = string.Empty;
        public bool         IsCover     { get; set; } = false;

        public int          PropertyId   { get; set; }
        public Property     Property    { get; set; } = null!;
    }
}
