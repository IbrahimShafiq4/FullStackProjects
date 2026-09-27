using CraftCommerce.Application.Interfaces;
using CraftCommerce.Domain.Entities;
using CraftCommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Infrastructure.Repositories
{
    public class GenericRepo<T> : IGenericRepo<T> where T : class
    {
        private readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepo(AppDbContext context) 
        { _context = context; _dbSet = context.Set<T>(); }
        public async Task<T?> GetByIdAsync(int id) => 
            await _dbSet.FindAsync(id);
        public async Task<List<T>> GetAllAsync() => 
            await _dbSet.ToListAsync();
        public async Task AddAsync(T entity) => 
            await _dbSet.AddAsync(entity);
        public void Remove(T entity) => 
            _dbSet.Remove(entity);
        public void UpdateAsync(T entity) =>
            _dbSet.Update(entity);
    }


    public class UnitOfWork: IUnitOfWork
    {
        private readonly AppDbContext           _context;
        public IGenericRepo<Product>            Products            { get; }
        public IGenericRepo<CartItem>           CartItems           { get; }
        public IGenericRepo<Order>              Orders              { get; }
        public IGenericRepo<Review>             Reviews             { get; }
        public IGenericRepo<Category>           Categories          { get; }
        public IGenericRepo<ShippingAddress>    ShippingAddresses   { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context            = context;
            Products            = new GenericRepo<Product>          (context);
            CartItems           = new GenericRepo<CartItem>         (context);
            Orders              = new GenericRepo<Order>            (context);
            Reviews             = new GenericRepo<Review>           (context);
            Categories          = new GenericRepo<Category>         (context);
            ShippingAddresses   = new GenericRepo<ShippingAddress>  (context);
        }

        public async Task<int> SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
