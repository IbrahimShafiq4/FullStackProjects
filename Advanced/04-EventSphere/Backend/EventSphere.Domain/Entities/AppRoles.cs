namespace EventSphere.Domain.Constants
{
    public static class AppRoles
    {
        public const string Admin = "Admin";
        public const string Organizer = "Organizer";
        public const string Attendee = "Attendee";

        public static readonly string[] All = { Admin, Organizer, Attendee };
    }
}