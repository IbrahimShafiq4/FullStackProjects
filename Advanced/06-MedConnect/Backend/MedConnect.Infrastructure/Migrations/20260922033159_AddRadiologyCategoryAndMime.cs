using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedConnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRadiologyCategoryAndMime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "RadiologyUploads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "RadiologyUploads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "RadiologyUploads");

            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "RadiologyUploads");
        }
    }
}
