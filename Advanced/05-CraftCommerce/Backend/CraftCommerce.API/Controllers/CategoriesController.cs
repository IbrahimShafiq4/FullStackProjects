using CraftCommerce.Application.Features;
using CraftCommerce.Application.Interfaces;
using CraftCommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CraftCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public CategoriesController(IUnitOfWork unitOfWork) { _unitOfWork = unitOfWork; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var list = await _unitOfWork.Categories.GetAllAsync();
            return Ok(list.Select(c => new CategoryDto(c.Id, c.Name)));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromForm] CreateCategoryDto dto)
        {
            var category = new Category { Name = dto.Name };
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { category.Id });
        }

        [HttpDelete("{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category is null) return NotFound();

            _unitOfWork.Categories.Remove(category);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { message = "تم الحذف بنجاح" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromForm] UpdateCategoryDto dto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category is null) return NotFound();

            category.Name = dto.Name;
            _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { message = "تم التعديل بنجاح", categoryName = category.Name });
        }
    }
}