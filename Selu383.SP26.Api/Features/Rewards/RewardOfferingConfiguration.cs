using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Rewards;

public class RewardOfferingConfiguration : IEntityTypeConfiguration<RewardOffering>
{
    public void Configure(EntityTypeBuilder<RewardOffering> builder)
    {
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.PointsRequired)
            .IsRequired();
    }
}