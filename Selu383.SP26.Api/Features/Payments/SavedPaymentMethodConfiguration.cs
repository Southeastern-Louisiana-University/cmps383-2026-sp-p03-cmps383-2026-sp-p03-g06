using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Payments;

public class SavedPaymentMethodConfiguration : IEntityTypeConfiguration<SavedPaymentMethod>
{
    public void Configure(EntityTypeBuilder<SavedPaymentMethod> builder)
    {
        builder.Property(x => x.CardholderName)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.CardLast4)
            .IsRequired()
            .HasMaxLength(4);

        builder.Property(x => x.CardType)
            .IsRequired()
            .HasMaxLength(30);
    }
}
