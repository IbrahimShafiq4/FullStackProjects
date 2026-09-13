using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Entities;

namespace Vaultly.Infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) {  }

        public DbSet<Quote>         Quotes          { get; set; }
        public DbSet<QuoteLineItem> QuoteLineItems  { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<QuoteLineItem>().Property(li => li.UnitPrice).HasPrecision(10, 2);

            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Freelancer)
                .WithMany()
                .HasForeignKey(q => q.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
