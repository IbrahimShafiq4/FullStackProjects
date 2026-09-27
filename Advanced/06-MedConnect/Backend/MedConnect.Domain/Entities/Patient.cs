using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Domain.Entities
{
    public class Patient
    {
        public int      Id          { get; set; }
        public string   FullName    { get; set; } = string.Empty;
        public string   UserId      { get; set; } = string.Empty;
    }
}
