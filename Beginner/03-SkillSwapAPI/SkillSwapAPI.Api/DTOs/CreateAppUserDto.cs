using Microsoft.AspNetCore.Mvc;

namespace SkillSwapAPI.Api.DTOs
{
    public class CreateAppUserDto
    {
        public string FullName { get; set; } = string.Empty;
    }
}
