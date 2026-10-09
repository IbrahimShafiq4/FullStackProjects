using R_FIT.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class PostTarget
    {
        public int          Id          { get; set; }
        public PlatformType Platform    { get; set; }
        public int          PostId      { get; set; }
        public Post         Post        { get; set; } = null!;
    }
}
