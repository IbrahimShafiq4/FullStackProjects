using GigLink.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Gig>       Gigs { get; set; }
        public DbSet<Proposal>  Proposals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Gig>()
                .Property(g => g.Budget)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Proposal>()
                .Property(p => p.ProposalPrice)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Gig>()
                .HasOne(g => g.Client)
                .WithMany()
                .HasForeignKey(g => g.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Proposal>()
                .HasOne(p => p.Freelancer)
                .WithMany()
                .HasForeignKey(p => p.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
