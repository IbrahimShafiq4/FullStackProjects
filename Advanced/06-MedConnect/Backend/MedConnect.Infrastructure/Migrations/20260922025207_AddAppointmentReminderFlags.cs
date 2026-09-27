using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedConnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentReminderFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DayBeforeReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DayOfReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PatientComplaint",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayBeforeReminderSent",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "DayOfReminderSent",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientComplaint",
                table: "Appointments");
        }
    }
}
