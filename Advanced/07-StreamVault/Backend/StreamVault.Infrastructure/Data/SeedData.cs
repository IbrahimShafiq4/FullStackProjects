using Microsoft.EntityFrameworkCore;
using StreamVault.Domain.Domain;

namespace StreamVault.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            if (!await context.Floors.AnyAsync())
            {
                context.Floors.AddRange(
                    new Floor
                    {
                        Number = 1,
                        Name = "الدور الأول",
                        Description = "فصول السنة الأولى — أساسيات ومقدمة"
                    },
                    new Floor
                    {
                        Number = 2,
                        Name = "الدور الثاني",
                        Description = "فصول السنة الثانية — تعميق المفاهيم"
                    },
                    new Floor
                    {
                        Number = 3,
                        Name = "الدور الثالث",
                        Description = "فصول السنة الثالثة — تخصصات متقدمة"
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}