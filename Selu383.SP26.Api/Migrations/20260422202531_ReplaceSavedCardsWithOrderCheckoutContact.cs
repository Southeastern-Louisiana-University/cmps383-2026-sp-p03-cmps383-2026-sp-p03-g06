using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceSavedCardsWithOrderCheckoutContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedPaymentMethods");

            migrationBuilder.AddColumn<string>(
                name: "CheckoutEmail",
                table: "Orders",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckoutFirstName",
                table: "Orders",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckoutLastName",
                table: "Orders",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CheckoutPhoneNumber",
                table: "Orders",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckoutEmail",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CheckoutFirstName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CheckoutLastName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CheckoutPhoneNumber",
                table: "Orders");

            migrationBuilder.CreateTable(
                name: "SavedPaymentMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CardLast4 = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    CardType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CardholderName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    ExpiryMonth = table.Column<int>(type: "int", nullable: false),
                    ExpiryYear = table.Column<int>(type: "int", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPaymentMethods", x => x.Id);
                });
        }
    }
}
