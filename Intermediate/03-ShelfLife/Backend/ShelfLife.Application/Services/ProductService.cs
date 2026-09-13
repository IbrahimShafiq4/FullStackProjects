using ShelfLife.Application.DTOs;
using ShelfLife.Application.Interfaces;
using ShelfLife.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetProductsWithFreshnessAsync(string userId);
    }

    public class ProductService: IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly IProductFreshnessCalculator _freshnessCalculator;

        public ProductService(IProductRepository productRepo, IProductFreshnessCalculator freshnessCalculator)
        { _productRepo = productRepo; _freshnessCalculator = freshnessCalculator; }

        public async Task<List<ProductDto>> GetProductsWithFreshnessAsync(string userId)
        {
            var product = await _productRepo.GetAllForUserAsync(userId);

            var today = DateTime.UtcNow;

            return product.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Quantity = p.Quantity,
                ExpiryDate = p.ExpiryDate,
                Freshness = _freshnessCalculator.Calculate(p, today).ToString(),
                PhotoUrl = p.PhotoUrl,
                VoiceNoteUrl = p.VoiceNoteUrl
            })
            .OrderBy(p => p.ExpiryDate)
            .ToList();
        }
    }
}
