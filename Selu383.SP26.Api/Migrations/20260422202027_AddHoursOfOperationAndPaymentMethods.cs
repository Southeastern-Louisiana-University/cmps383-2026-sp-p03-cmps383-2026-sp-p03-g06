using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHoursOfOperationAndPaymentMethods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HoursOfOperation",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SavedPaymentMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CardholderName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    CardLast4 = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    CardType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ExpiryMonth = table.Column<int>(type: "int", nullable: false),
                    ExpiryYear = table.Column<int>(type: "int", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPaymentMethods", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedPaymentMethods");

            migrationBuilder.DropColumn(
                name: "HoursOfOperation",
                table: "Locations");
        }
    }
}
