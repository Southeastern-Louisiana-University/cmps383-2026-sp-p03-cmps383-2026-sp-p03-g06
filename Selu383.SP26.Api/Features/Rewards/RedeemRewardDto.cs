using System.ComponentModel.DataAnnotations;

namespace Selu383.SP26.Api.Features.Rewards;

public class RedeemRewardDto
{
    [Range(1, int.MaxValue)]
    public int RewardOfferingId { get; set; }
}
