using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedConnect.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPrescriptionMedicationsJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Medications",
                table: "Prescriptions",
                newName: "MedicationsJson");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MedicationsJson",
                table: "Prescriptions",
                newName: "Medications");
        }
    }
}
