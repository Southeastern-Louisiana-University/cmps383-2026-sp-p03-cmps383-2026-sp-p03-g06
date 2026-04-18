using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Rewards;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RewardsController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public RewardsController(DataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
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
        var user = await _userManager.GetUserAsync(User);

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
}