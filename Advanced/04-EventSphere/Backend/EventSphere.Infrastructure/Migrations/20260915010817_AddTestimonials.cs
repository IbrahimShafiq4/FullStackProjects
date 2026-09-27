using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EventSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTestimonials : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Testimonials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Hieroglyph = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testimonials", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Testimonials",
                columns: new[] { "Id", "City", "CreatedAt", "Hieroglyph", "IsPublished", "Message", "Name", "Rating", "Role" },
                values: new object[,]
                {
                    { 1, "القاهرة", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "𓂀", true, "أفضل منصة لتنظيم الفعاليات الكبرى. الحجز بالمقاعد مريح جدًا والتحليلات بتساعدني أعرف نجاح كل فعالية.", "إبراهيم شفيق", 5, "منظّم فعاليات" },
                    { 2, "القاهرة", new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "𓋹", true, "اختيار المقعد بسهولة، الحجز المؤقت بيخليك مرتاح، والتأكيد فوري. تجربة ممتازة!", "رؤى ياسر", 5, "حضور دائم" },
                    { 3, "القاهرة", new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "𓅓", true, "بنستخدمها لإدارة كل الفعاليات في المكان. لوحة التحليلات بتورينا نسبة الإشغال والإيرادات في الوقت الحقيقي.", "أحمد شفيق", 5, "مدير معبد" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_IsPublished",
                table: "Testimonials",
                column: "IsPublished");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Testimonials");
        }
    }
}
