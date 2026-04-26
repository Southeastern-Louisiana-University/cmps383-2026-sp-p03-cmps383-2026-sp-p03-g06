namespace Selu383.SP26.Api.Features.Rewards;

public class RewardRedemption
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int RewardOfferingId { get; set; }

    public int PointsSpent { get; set; }

    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;
}
