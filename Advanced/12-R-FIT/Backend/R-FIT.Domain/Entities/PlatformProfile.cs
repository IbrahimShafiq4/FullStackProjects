using R_FIT.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class PlatformProfile
    {
        public int          Id              { get; set; }
        public PlatformType Platform        { get; set; }
        public string       DisplayName     { get; set; } = string.Empty;
        public string       Bio             { get; set; } = string.Empty;
        public string?      CoverImageUrl   { get; set; }
        public string       AppUserId       { get; set; } = string.Empty;
        public AppUser      User            { get; set; } = null!;
    }
}
