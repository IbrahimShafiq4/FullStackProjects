using StreamVault.Domain.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Entities
{
    public class TeacherWallet
    {
        public int Id { get; set; }
        public string TeacherId { get; set; } = string.Empty;
        public Instructor Teacher { get; set; } = null!;
        public string Provider { get; set; } = string.Empty;
        public string WalletNumber { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
