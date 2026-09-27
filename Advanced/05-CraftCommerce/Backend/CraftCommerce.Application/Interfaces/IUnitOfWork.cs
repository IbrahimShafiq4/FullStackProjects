using CraftCommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepo<Product>           Products { get; }
        IGenericRepo<CartItem>          CartItems { get; }
        IGenericRepo<Order>             Orders { get; }
        IGenericRepo<Review>            Reviews { get; }
        IGenericRepo<Category>          Categories { get; }
        IGenericRepo<ShippingAddress>   ShippingAddresses { get; }
        Task<int> SaveChangesAsync();
    }

    public interface IGenericRepo<T> where T: class
    {
        Task<T?>        GetByIdAsync(int id);
        Task<List<T>>   GetAllAsync();
        Task            AddAsync(T entity);
        void            UpdateAsync(T entity);
        void            Remove(T entity);
    }
}
