using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;
using Selu383.SP26.Api.Features.Orders;
using System.Transactions;

namespace Selu383.SP26.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> userManager;
    private readonly DataContext dataContext;

    public UsersController(UserManager<User> userManager, DataContext dataContext)
    {
        this.userManager = userManager;
        this.dataContext = dataContext;
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var newUser = new User
        {
            UserName = dto.UserName,
        };
        var createResult = await userManager.CreateAsync(newUser, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest();
        }

        try
        {
            var roleResult = await userManager.AddToRolesAsync(newUser, dto.Roles);
            if (!roleResult.Succeeded)
            {
                return BadRequest();
            }
        }
        catch (InvalidOperationException e) when(e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
        {
            return BadRequest();
        }

        transaction.Complete();

        return Ok(new UserDto
        {
            Id = newUser.Id,
            Roles = dto.Roles,
            Email = newUser.Email,
            PhoneNumber = newUser.PhoneNumber,
            UserName = newUser.UserName,
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        var userId = User.GetCurrentUserId();
        
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        var roles = await userManager.GetRolesAsync(user);
        var orderCount = dataContext.Set<Order>()
            .Count(x => x.CustomerId == userId);

        return Ok(new ProfileDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            PreferredLocationId = user.PreferredLocationId,
            Roles = roles.ToList(),
            OrderCount = orderCount
        });
    }

    [HttpGet("me/orders")]
    [Authorize]
    public ActionResult<IEnumerable<OrderDto>> GetMyOrders()
    {
        var userId = User.GetCurrentUserId();

        var allOrders = dataContext.Set<Order>().ToList();

        Console.WriteLine($"Current User ID: {userId}");

        foreach (var order in allOrders)
        {
            Console.WriteLine($"Order ID: {order.Id}, CustomerId: {order.CustomerId}");
        }

        var orders = dataContext.Set<Order>()
            .Include(x => x.OrderItems)
            .Where(x => x.CustomerId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToList()
            .Select(x => MapOrderToDto(x))
            .ToList();

        return Ok(orders);
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = User.GetCurrentUserId();
        
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        // Verify location exists if specified
        if (dto.PreferredLocationId.HasValue && dto.PreferredLocationId > 0)
        {
            var locationExists = dataContext.Set<Location>()
                .Any(x => x.Id == dto.PreferredLocationId.Value);
            
            if (!locationExists)
            {
                return BadRequest("Location does not exist");
            }
        }

        user.Email = dto.Email ?? user.Email;
        user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;
        user.Address = dto.Address ?? user.Address;
        user.PreferredLocationId = dto.PreferredLocationId ?? user.PreferredLocationId;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest("Failed to update profile");
        }

        var roles = await userManager.GetRolesAsync(user);
        var orderCount = dataContext.Set<Order>()
            .Count(x => x.CustomerId == userId);

        return Ok(new ProfileDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            PreferredLocationId = user.PreferredLocationId,
            Roles = roles.ToList(),
            OrderCount = orderCount
        });
    }

    private OrderDto MapOrderToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            CustomerName = order.CustomerName,
            CheckoutFirstName = order.CheckoutFirstName,
            CheckoutLastName = order.CheckoutLastName,
            CheckoutEmail = order.CheckoutEmail,
            CheckoutPhoneNumber = order.CheckoutPhoneNumber,
            LocationId = order.LocationId,
            TotalPrice = order.TotalPrice,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            PickedUpAt = order.PickedUpAt,
            OrderItems = order.OrderItems?.Select(x => new OrderItemDto
            {
                Id = x.Id,
                MenuItemId = x.MenuItemId,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
                TotalPrice = x.TotalPrice,
                CustomizationJson = x.CustomizationJson
            }).ToList() ?? new List<OrderItemDto>()
        };
    }
}
