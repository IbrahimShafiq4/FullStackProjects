using CraftCommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<Artisan>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Category>          Categories          { get; set; } = null!;
        public DbSet<Product>           Products            { get; set; } = null!;
        public DbSet<ProductImage>      ProductImages       { get; set; } = null!;
        public DbSet<CartItem>          CartItems           { get; set; } = null!;
        public DbSet<ShippingAddress>   ShippingAddresses   { get; set; } = null!;
        public DbSet<Order>             Orders              { get; set; } = null!;
        public DbSet<OrderItem>         OrderItems          { get; set; } = null!;
        public DbSet<Review>            Reviews             { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Product>     ().Property(p   => p.Price          ).HasPrecision(10, 2);
            builder.Entity<Order>       ().Property(o   => o.SubTotal       ).HasPrecision(10, 2);
            builder.Entity<Order>       ().Property(o   => o.ShippingCost   ).HasPrecision(10, 2);
            builder.Entity<Order>       ().Property(o   => o.Total          ).HasPrecision(10, 2);
            builder.Entity<OrderItem>   ().Property(oi  => oi.UnitPrice     ).HasPrecision(10, 2);
        }
    }
}
