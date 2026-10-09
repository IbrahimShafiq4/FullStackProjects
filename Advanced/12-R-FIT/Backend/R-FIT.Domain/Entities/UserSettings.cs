using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class UserSettings
    {
        public int      Id                  { get; set; }
        public bool     IsPrivateAccount    { get; set; } = false;
        public bool     EmailNotifications  { get; set; } = true;
        public bool     PushNotifications   { get; set; } = true;
        public string   PreferredLanguage   { get; set; } = "ar";
        public string   UserId              { get; set; } = string.Empty;
        public AppUser  User                { get; set; } = null!;
    }
}
