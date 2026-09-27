using CraftCommerce.Application.Features;
using CraftCommerce.Application.Services;
using CraftCommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CraftCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IOrderService _orderService;
        public OrdersController
        (
            AppDbContext context, 
            IOrderService orderService
        )
        { _context = context; _orderService = orderService; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var orders = await _context.Orders
                            .Where(o => o.BuyerId == GetCurrentUserId())
                            .Select(o => new OrderDto(
                                    o.Id,
                                    o.SubTotal,
                                    o.ShippingCost,
                                    o.Total,
                                    o.Status.ToString(),
                                    o.CreatedAt
                                )
                            ).ToListAsync();

            return Ok(orders);
        }

        [HttpPost("checkout/{addressId}")]
        public async Task<IActionResult> Checkout(int addressId) 
        {
            var (success, error, orderId) = await _orderService.PlaceOrderAsync(GetCurrentUserId(), addressId);
            return success ? Ok(new { orderId }) : BadRequest(error);
        }

        [HttpGet("{orderId}/details")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            var order = await _context.Orders
                            .Include(o => o.Items)
                            .ThenInclude(i => i.Product)
                            .FirstOrDefaultAsync(o => o.Id == orderId && o.BuyerId == GetCurrentUserId());

            if (order is null) return NotFound();
              
            return Ok(new
            {
                order.Id,
                order.SubTotal,
                order.ShippingCost,
                order.Total,
                Status = order.Status.ToString(),
                order.CreatedAt,
                items = order.Items.Select(i => new
                {
                    i.ProductId,
                    ProductName = i.Product.Name,
                    i.Quantity,
                    i.UnitPrice
                })
            });
        }


    }
}
