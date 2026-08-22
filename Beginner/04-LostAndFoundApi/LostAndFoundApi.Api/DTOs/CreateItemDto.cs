using LostAndFoundApi.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace LostAndFoundApi.Api.DTOs
{
    public class CreateItemDto
    {
        public string Title         { get; set; } = string.Empty;
        public string Description   { get; set; } = string.Empty;
        public string Category      { get; set; } = string.Empty;
        public string Location      { get; set; } = string.Empty;
        public ItemType Type        { get; set; }
    }
}
