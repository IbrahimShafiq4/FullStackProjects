using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShelfLife.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTestimonialAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Challenges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Reward = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Days = table.Column<int>(type: "int", nullable: false),
                    Target = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Challenges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Testimonials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Quote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Initials = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testimonials", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 58, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 55, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 52, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 48, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 42, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 13, 23, 35, 0, 0, DateTimeKind.Utc));

            migrationBuilder.InsertData(
                table: "Challenges",
                columns: new[] { "Id", "CreatedAt", "Days", "Description", "IsActive", "Reward", "Target", "Title" },
                values: new object[] { 1, new DateTime(2026, 9, 7, 0, 0, 0, 0, DateTimeKind.Utc), 5, "استخدم 5 منتجات من مخزونك قبل ما تخلص. لو كملت التحدي، هتكسب شارة \"مطبخ ذكي\" — وبتوفر فلوس في نفس الوقت.", true, "🏅 SMART KITCHEN BADGE", 5, "تحدي الأسبوع" });

            migrationBuilder.InsertData(
                table: "Testimonials",
                columns: new[] { "Id", "City", "CreatedAt", "Initials", "IsApproved", "Name", "Quote", "Rating", "Role" },
                values: new object[,]
                {
                    { 1, "القاهرة", new DateTime(2026, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), "ر", true, "رؤى ياسر", "قبل كده كنت بنسى الأكل في التلاجة وأكتشفه بعد ما يبوظ. دلوقتي كل حاجة واضحة قدامي، وأوفر فلوس كتير على المشتريات.", 5, "ربة منزل" },
                    { 2, "القاهرة", new DateTime(2026, 8, 25, 0, 0, 0, 0, DateTimeKind.Utc), "أ", true, "أحمد شفيق", "الملاحظات الصوتية عبقرية. بسجّل \"ده للعشا\" وأنا في المطبخ وإيدي مليانة. حاجة بسيطة بس بتفرق كتير.", 5, "digital Marketing" },
                    { 3, "القاهرة", new DateTime(2026, 8, 30, 0, 0, 0, 0, DateTimeKind.Utc), "إ", true, "إبراهيم شفيق", "بقت أطبخ من اللي عندي بدل ما أطلب دليفري كل يوم. وفّرت مصروف كبير، ومبسوط إني بقيت أهتم بأكل بيتي.", 5, "Software engineer" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_IsApproved",
                table: "Testimonials",
                column: "IsApproved");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Challenges");

            migrationBuilder.DropTable(
                name: "Testimonials");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 29, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 26, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 23, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 19, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 13, 0, 0, DateTimeKind.Utc));

            migrationBuilder.UpdateData(
                table: "ActivityItems",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 14, 0, 6, 0, 0, DateTimeKind.Utc));
        }
    }
}
