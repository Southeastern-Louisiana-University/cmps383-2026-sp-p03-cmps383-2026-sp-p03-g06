using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class SyncPendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RewardOffering",
                table: "RewardOffering");

            migrationBuilder.RenameTable(
                name: "RewardOffering",
                newName: "RewardOfferings");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RewardOfferings",
                table: "RewardOfferings",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RewardOfferings",
                table: "RewardOfferings");

            migrationBuilder.RenameTable(
                name: "RewardOfferings",
                newName: "RewardOffering");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RewardOffering",
                table: "RewardOffering",
                column: "Id");
        }
    }
}
