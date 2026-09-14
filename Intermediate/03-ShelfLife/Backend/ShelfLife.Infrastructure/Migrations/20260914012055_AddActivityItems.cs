using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShelfLife.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddActivityItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActivityItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserInitial = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Action = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    City = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityItems", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ActivityItems",
                columns: new[] { "Id", "Action", "City", "CreatedAt", "UserInitial", "UserName" },
                values: new object[,]
                {
                    { 1, "أضاف 5 منتجات للمخزون", "القاهرة", new DateTime(2026, 9, 14, 0, 29, 0, 0, DateTimeKind.Utc), "أ", "أحمد مصطفى" },
                    { 2, "وفّرت 120 ج.م هذا الأسبوع", "القاهرة", new DateTime(2026, 9, 14, 0, 26, 0, 0, DateTimeKind.Utc), "م", "منة شريف" },
                    { 3, "سجّل ملاحظة صوتية على اللبن", "القاهرة", new DateTime(2026, 9, 14, 0, 23, 0, 0, DateTimeKind.Utc), "ي", "يوسف سامي" },
                    { 4, "أكملت تحدي الأسبوع", "القاهرة", new DateTime(2026, 9, 14, 0, 19, 0, 0, DateTimeKind.Utc), "ن", "نور ياسر" },
                    { 5, "أنشأ فيديو وصفة جديدة", "القاهرة", new DateTime(2026, 9, 14, 0, 13, 0, 0, DateTimeKind.Utc), "ك", "كريم فؤاد" },
                    { 6, "قلّلت الهدر بنسبة 40%", "القاهرة", new DateTime(2026, 9, 14, 0, 6, 0, 0, DateTimeKind.Utc), "هـ", "هبة محمود" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityItems_CreatedAt",
                table: "ActivityItems",
                column: "CreatedAt",
                descending: new bool[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityItems");
        }
    }
}
