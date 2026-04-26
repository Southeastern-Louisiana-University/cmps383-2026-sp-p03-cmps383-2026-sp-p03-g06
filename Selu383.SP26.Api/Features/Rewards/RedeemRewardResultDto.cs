namespace Selu383.SP26.Api.Features.Rewards;

public class RedeemRewardResultDto
{
    public int RemainingPoints { get; set; }

    public RewardRedemptionDto Redemption { get; set; } = new();
}
