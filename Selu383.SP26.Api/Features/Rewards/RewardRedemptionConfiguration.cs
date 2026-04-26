using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP26.Api.Features.Auth;

namespace Selu383.SP26.Api.Features.Rewards;

public class RewardRedemptionConfiguration : IEntityTypeConfiguration<RewardRedemption>
{
    public void Configure(EntityTypeBuilder<RewardRedemption> builder)
    {
        builder.Property(x => x.PointsSpent)
            .IsRequired();

        builder.Property(x => x.RedeemedAt)
            .IsRequired();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<RewardOffering>()
            .WithMany()
            .HasForeignKey(x => x.RewardOfferingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
