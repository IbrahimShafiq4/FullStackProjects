using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMesh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCardConnectionColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Connections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Connections");
        }
    }
}
