using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShelfLife.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppUserIdToTestimonial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Testimonials",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Testimonials",
                keyColumn: "Id",
                keyValue: 1,
                column: "AppUserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Testimonials",
                keyColumn: "Id",
                keyValue: 2,
                column: "AppUserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Testimonials",
                keyColumn: "Id",
                keyValue: 3,
                column: "AppUserId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_AppUserId",
                table: "Testimonials",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Testimonials_AspNetUsers_AppUserId",
                table: "Testimonials",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Testimonials_AspNetUsers_AppUserId",
                table: "Testimonials");

            migrationBuilder.DropIndex(
                name: "IX_Testimonials_AppUserId",
                table: "Testimonials");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Testimonials");
        }
    }
}
