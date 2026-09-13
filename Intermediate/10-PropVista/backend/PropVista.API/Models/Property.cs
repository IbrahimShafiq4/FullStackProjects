namespace PropVista.API.Models
{
    public enum ListingType { Sale = 1, Rent = 2 }

    public class Property
    {
        public int                  Id              { get; set; }
        public string               Title           { get; set; } = string.Empty;
        public string               Description     { get; set; } = string.Empty;
        public decimal              Price           { get; set; }
        public ListingType          ListingType     { get; set; }
        public string?              TourVideoUrl    { get; set; }

        public string               OwnerId         { get; set; } = string.Empty;
        public AppUser              Owner           { get; set; } = null!;

        public List<PropertyImage>  Images          { get; set; } = new();
        public List<Viewing>        Viewings        { get; set; } = new();
    }
}
