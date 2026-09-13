using Microsoft.EntityFrameworkCore;
using ShelfLife.Application.Interfaces;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Infrastructure.Repositories
{
    public class ProductRepository: IProductRepository
    {
        private readonly AppDbContext   _context;
        private readonly DbSet<Product> _dbSet;

        public ProductRepository(AppDbContext context)
        { _context = context; _dbSet = _context.Set<Product>(); }

        public async Task<List<Product>> GetAllForUserAsync(string userId) =>
            await _dbSet.Where(p => p.AppUserId == userId).ToListAsync();

        public async Task<Product?> GetByIdAsync(int id) =>
            await _dbSet.FindAsync(id);

        public async Task AddAsync(Product product) =>
            await _dbSet.AddAsync(product);

        public async Task DeleteAsync(Product product)
        {
            _dbSet.Remove(product);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
