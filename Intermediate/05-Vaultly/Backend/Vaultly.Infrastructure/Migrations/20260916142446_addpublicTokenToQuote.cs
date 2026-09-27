using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vaultly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addpublicTokenToQuote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClientNote",
                table: "Quotes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClientRespondedAt",
                table: "Quotes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClientViewedAt",
                table: "Quotes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicToken",
                table: "Quotes",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "Quotes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_PublicToken",
                table: "Quotes",
                column: "PublicToken",
                unique: true,
                filter: "[PublicToken] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quotes_PublicToken",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "ClientNote",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "ClientRespondedAt",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "ClientViewedAt",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "PublicToken",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "Quotes");
        }
    }
}
