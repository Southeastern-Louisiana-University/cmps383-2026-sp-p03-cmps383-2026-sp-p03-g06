using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Orders;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(x => x.CustomerName)
            .HasMaxLength(120);

        builder.Property(x => x.CheckoutFirstName)
            .HasMaxLength(80);

        builder.Property(x => x.CheckoutLastName)
            .HasMaxLength(80);

        builder.Property(x => x.CheckoutEmail)
            .HasMaxLength(256);

        builder.Property(x => x.CheckoutPhoneNumber)
            .HasMaxLength(30);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.TotalPrice)
            .HasColumnType("decimal(18,2)");

        builder.HasMany(x => x.OrderItems)
            .WithOne()
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
