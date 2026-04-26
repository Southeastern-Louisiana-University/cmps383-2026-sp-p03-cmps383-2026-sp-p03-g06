using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Rewards;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RewardsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public RewardsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet("offerings")]
    public async Task<ActionResult<IEnumerable<RewardOfferingDto>>> GetOfferings()
    {
        var offerings = await _dataContext.RewardOfferings
            .Where(x => x.IsActive)
            .Select(x => new RewardOfferingDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                PointsRequired = x.PointsRequired,
                IsActive = x.IsActive
            })
            .ToListAsync();

        return Ok(offerings);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<object>> GetMyRewards()
    {
        var userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Id == userId.Value);

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.RewardPoints
        });
    }

    [Authorize]
    [HttpPost("redeem")]
    public async Task<ActionResult<RedeemRewardResultDto>> RedeemReward(RedeemRewardDto dto)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Id == userId.Value);
        if (user == null)
        {
            return Unauthorized();
        }

        var offering = await _dataContext.RewardOfferings
            .FirstOrDefaultAsync(x => x.Id == dto.RewardOfferingId && x.IsActive);
        if (offering == null)
        {
            return NotFound("Reward offering not found");
        }

        if (user.RewardPoints < offering.PointsRequired)
        {
            return BadRequest("Not enough points to redeem this reward");
        }

        user.RewardPoints -= offering.PointsRequired;

        var redemption = new RewardRedemption
        {
            UserId = user.Id,
            RewardOfferingId = offering.Id,
            PointsSpent = offering.PointsRequired,
            RedeemedAt = DateTime.UtcNow
        };

        _dataContext.RewardRedemptions.Add(redemption);
        await _dataContext.SaveChangesAsync();

        return Ok(new RedeemRewardResultDto
        {
            RemainingPoints = user.RewardPoints,
            Redemption = new RewardRedemptionDto
            {
                Id = redemption.Id,
                RewardOfferingId = offering.Id,
                RewardName = offering.Name,
                PointsSpent = redemption.PointsSpent,
                RedeemedAt = redemption.RedeemedAt
            }
        });
    }

    [Authorize]
    [HttpGet("redemptions/me")]
    public async Task<ActionResult<IEnumerable<RewardRedemptionDto>>> GetMyRedemptions()
    {
        var userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var redemptions = await _dataContext.RewardRedemptions
            .Where(x => x.UserId == userId.Value)
            .OrderByDescending(x => x.RedeemedAt)
            .Join(
                _dataContext.RewardOfferings,
                redemption => redemption.RewardOfferingId,
                offering => offering.Id,
                (redemption, offering) => new RewardRedemptionDto
                {
                    Id = redemption.Id,
                    RewardOfferingId = offering.Id,
                    RewardName = offering.Name,
                    PointsSpent = redemption.PointsSpent,
                    RedeemedAt = redemption.RedeemedAt
                })
            .ToListAsync();

        return Ok(redemptions);
    }
}