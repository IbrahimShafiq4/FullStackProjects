using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Domain
{
    public class WatchProgress
    {
        public int      Id                  { get; set; }
        public int      LastPositionSeconds { get; set; }
        public string   ViewerId            { get; set; } = string.Empty;
        public int      VideoId             { get; set; }
        public Video    Video               { get; set; } = null!;
    }
}
