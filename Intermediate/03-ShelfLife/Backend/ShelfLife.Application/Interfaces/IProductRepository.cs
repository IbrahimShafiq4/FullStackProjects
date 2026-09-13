using ShelfLife.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllForUserAsync(string userId);
        Task<Product?>      GetByIdAsync(int id);
        Task                AddAsync(Product product);
        Task                DeleteAsync(Product product);
        Task                SaveChangesAsync();
    }
}
