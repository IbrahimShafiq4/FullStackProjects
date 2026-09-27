using CraftCommerce.Application.Interfaces;
using CraftCommerce.Domain.Entities;
using CraftCommerce.Infrastructure.Data;
using CraftCommerce.Infrastructure.Services.ShippingStrategies;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Application.Services
{
    public interface IOrderService
    {
        Task<(bool success, string? error, int? orderId)> PlaceOrderAsync(string buyerId, int shippingAddressId);
    }

    public class OrderService: IOrderService
    {
        private readonly IUnitOfWork                _unitOfWork;
        private readonly IShippingStrategyFactory   _shippingFactory;
        private readonly AppDbContext               _context;

        public OrderService
        (
            IUnitOfWork                 unitOfWork,
            IShippingStrategyFactory    shippingStrategy,
            AppDbContext                context
        )
        {
            _unitOfWork         = unitOfWork;
            _shippingFactory    = shippingStrategy;
            _context            = context;
        }

        public async Task<(bool success, string? error, int? orderId)> PlaceOrderAsync(string buyerId, int shippingAddressId)
        {
            var cartItems = await _context.CartItems
                                .Include(ci => ci.Product)
                                .Where(ci => ci.BuyerId == buyerId)
                                .ToListAsync();

            if (cartItems.Count == 0)
                return (false, "عربة التسوق فارغة", null);

            var address = await _unitOfWork.ShippingAddresses
                                .GetByIdAsync(shippingAddressId);

            if (address == null)
                return (false, "عنوان الشحن غير موجود", null);

            foreach(var item in cartItems)
                if (item.Product.StockQuantity < item.Quantity)
                    return (false, $"الكمية المتاحة من {item.Product.Name} غير كافية.", null);

            var subTotal = cartItems.Sum(c => c.Product.Price * c.Quantity);
            var shippingStrategy = _shippingFactory.GetStrategy(address.Zone);
            var shippingCost = shippingStrategy.CalculateShippingCost(address.Zone, subTotal);

            var order = new Order
            {
                BuyerId             = buyerId,
                ShippingAddressId   = shippingAddressId,
                SubTotal            = subTotal,
                ShippingCost        = shippingCost,
                Total               = subTotal + shippingCost,
                Items               = cartItems.Select(c => new OrderItem
                {
                    ProductId       = c.ProductId,
                    Quantity        = c.Quantity,
                    UnitPrice       = c.Product.Price
                }).ToList()
            };

            foreach (var item in cartItems)
                item.Product.StockQuantity -= item.Quantity;

            await _context.Orders.AddAsync(order);
            _context.CartItems.RemoveRange(cartItems);
            await _unitOfWork.SaveChangesAsync();

            return (true, null, order.Id);
        }
    }
}
