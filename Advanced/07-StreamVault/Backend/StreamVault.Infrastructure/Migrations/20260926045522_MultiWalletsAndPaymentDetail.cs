using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StreamVault.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MultiWalletsAndPaymentDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeacherWallets_TeacherId",
                table: "TeacherWallets");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "TeacherWallets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_TeacherWallets_TeacherId",
                table: "TeacherWallets",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeacherWallets_TeacherId",
                table: "TeacherWallets");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "TeacherWallets");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherWallets_TeacherId",
                table: "TeacherWallets",
                column: "TeacherId",
                unique: true);
        }
    }
}
