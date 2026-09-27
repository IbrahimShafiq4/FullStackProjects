using CraftCommerce.Application.Features;
using CraftCommerce.Domain.Entities;
using CraftCommerce.Domain.Enums;
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
    public class AddressesController : Controller
    {
        private readonly AppDbContext _context;
        public AddressesController(AppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        public async Task<IActionResult> CreateAddress(CreateAddressDto dto)
        {
            if (!Enum.TryParse<ShippingZone>(dto.Zone, true, out var zone))
                return BadRequest("منطقة الشحن غير صحيحة");
            var address = new ShippingAddress
            {
                City        = dto.City,
                Country     = dto.Country,
                BuyerId     = GetCurrentUserId(),
                FullAddress = dto.FullAddress,
                Zone        = zone,
            };
            _context.ShippingAddresses.Add(address);
            await _context.SaveChangesAsync();
            return Ok(new { address.Id });
        }

        [HttpGet]
        public async Task<IActionResult> GetAddresses()
        {
            var addresses = await _context.ShippingAddresses
                .Where(sa => sa.BuyerId == GetCurrentUserId())
                .Select(
                    sa => new AddressDto(
                            sa.Id,
                            sa.City, 
                            sa.Country, 
                            sa.FullAddress, 
                            sa.Zone.ToString()
                        )
                    )
                .ToListAsync();
            return Ok(addresses);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _context.ShippingAddresses
                    .FirstOrDefaultAsync(sa => sa.BuyerId == GetCurrentUserId() && sa.Id == id);
            if (address is null) return NotFound();

            _context.ShippingAddresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف العنوان بنجاح" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, AddressDto dto)
        {
            var address = await _context.ShippingAddresses
                                .FirstOrDefaultAsync(a =>
                                    a.Id == id &&
                                    a.BuyerId == GetCurrentUserId());

            if (address is null) return NotFound(new { message = "العنوان دا مش موجود" });

            if (!Enum.TryParse<ShippingZone>(dto.Zone, true, out var zone)) { return BadRequest(new { message = "منطقة الشحن غير صحيحة" }); }

            address.City = dto.City;
            address.FullAddress = dto.FullAddress;
            address.Country = dto.Country;
            address.Zone = zone;

            _context.ShippingAddresses.Update(address);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم تعديل العنوان {address.FullAddress} بنجاح", addressId = address.Id });
        }
        
    }
}
