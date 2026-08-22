using EventHive.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Event> Events  { get; set; }
        public DbSet<Rsvp>  Rsvps   { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany()
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rsvp>()
                .HasOne(r => r.Attendee)
                .WithMany()
                .HasForeignKey(r => r.AttendeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rsvp>()
                .HasOne(r => r.Event)
                .WithMany(e => e.Rsvps)
                .HasForeignKey(r => r.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Event>()
                .HasIndex(e => e.StartDate);

            modelBuilder.Entity<Event>()
                .HasIndex(e => e.OrganizerId);
        }
    }
}
