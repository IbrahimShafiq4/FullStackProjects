using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SoundVaultAPI.Models;

namespace SoundVaultAPI.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) {  }

        public DbSet<SoundItem> Sounds { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) { base.OnModelCreating(builder); }
    }
}
