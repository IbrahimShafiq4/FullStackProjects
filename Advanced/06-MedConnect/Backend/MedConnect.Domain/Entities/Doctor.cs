using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Domain.Entities
{
    public class Doctor: IdentityUser
    {
        public string FullName                          { get; set; } = string.Empty;
        public string Specialty                         { get; set; } = string.Empty;
        public List<AvailabilitySlot> AvailabilitySlots { get; set; } = new();
    }
}
