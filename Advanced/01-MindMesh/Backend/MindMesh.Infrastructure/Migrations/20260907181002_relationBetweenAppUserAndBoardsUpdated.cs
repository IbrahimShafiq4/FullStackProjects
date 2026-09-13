using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMesh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class relationBetweenAppUserAndBoardsUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Boards_AspNetUsers_AppUserId",
                table: "Boards");

            migrationBuilder.DropIndex(
                name: "IX_Boards_AppUserId",
                table: "Boards");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Boards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Boards",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Boards_AppUserId",
                table: "Boards",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Boards_AspNetUsers_AppUserId",
                table: "Boards",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
