using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;
using Selu383.SP26.Api.Features.Orders;
using Selu383.SP26.Api.Features.Rewards;

namespace Selu383.SP26.Api.Controllers;

[Route("api/orders")]
[ApiController]
public class OrdersController(DataContext dataContext, UserManager<User> userManager) : ControllerBase{
    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<OrderDto>> GetMyOrders()
    {
        var userId = User.GetCurrentUserId();
        
        var orders = dataContext.Set<Order>()
            .Where(x => x.CustomerId == userId)
            .Select(x => MapOrderToDto(x))
            .ToList();

        return Ok(orders);
    }

    [HttpGet("all")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<IEnumerable<OrderDto>> GetAllOrders()
    {
        var orders = dataContext.Set<Order>()
            .Select(x => MapOrderToDto(x))
            .ToList();

        return Ok(orders);
    }

    [HttpGet("{id}")]
    [Authorize]
    public ActionResult<OrderDto> GetById(int id)
    {
        var userId = User.GetCurrentUserId();
        
        var order = dataContext.Set<Order>()
            .FirstOrDefault(x => x.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        // Check authorization: user can only see their own orders, admins can see all
        if (order.CustomerId != userId && !User.IsInRole(RoleNames.Admin))
        {
            return Forbid();
        }

        return Ok(MapOrderToDto(order));
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        if (dto.LocationId <= 0)
        {
            return BadRequest("Valid LocationId is required");
        }

        if (dto.OrderItems == null || !dto.OrderItems.Any())
        {
            return BadRequest("Order must contain at least one item");
        }

        var userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var locationExists = dataContext.Set<Location>()
            .Any(x => x.Id == dto.LocationId);

        if (!locationExists)
        {
            return BadRequest("Location does not exist");
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return Unauthorized();
        }

        RewardOffering? rewardOffering = null;

        if (dto.RewardOfferingId.HasValue || dto.RewardedMenuItemId.HasValue)
        {
            if (!dto.RewardOfferingId.HasValue || !dto.RewardedMenuItemId.HasValue)
            {
                return BadRequest("RewardOfferingId and RewardedMenuItemId are both required when using a reward.");
            }

            rewardOffering = dataContext.Set<RewardOffering>()
                .FirstOrDefault(x => x.Id == dto.RewardOfferingId.Value && x.IsActive);

            if (rewardOffering == null)
            {
                return BadRequest("Reward offering not found.");
            }

            if (user.RewardPoints < rewardOffering.PointsRequired)
            {
                return BadRequest("Not enough points to redeem this reward.");
            }
        }

        var orderTotal = decimal.Zero;
        var orderItemsToAdd = new List<OrderItem>();

        foreach (var itemDto in dto.OrderItems)
        {
            if (itemDto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            var menuItem = dataContext.Set<Features.MenuItem.MenuItem>()
                .FirstOrDefault(x => x.Id == itemDto.MenuItemId);

            if (menuItem == null)
            {
                return BadRequest($"Menu item {itemDto.MenuItemId} does not exist");
            }

            var unitPrice = OrderPricingHelper.CalculateUnitPrice(
                menuItem.Price,
                itemDto.CustomizationJson
            );

            var isRewardedItem =
                rewardOffering != null &&
                dto.RewardedMenuItemId.HasValue &&
                itemDto.MenuItemId == dto.RewardedMenuItemId.Value;

            if (isRewardedItem)
            {
                unitPrice = 0m;
            }

            var itemTotal = unitPrice * itemDto.Quantity;
            orderTotal += itemTotal;

            orderItemsToAdd.Add(new OrderItem
            {
                MenuItemId = itemDto.MenuItemId,
                Quantity = itemDto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = itemTotal,
                CustomizationJson = itemDto.CustomizationJson
            });
        }

        var first = dto.CheckoutFirstName.Trim();
        var last = dto.CheckoutLastName.Trim();

        var order = new Order
        {
            CustomerId = userId,
            CustomerName = $"{first} {last}".Trim(),
            LocationId = dto.LocationId,
            TotalPrice = orderTotal,
            Status = "Pending",
            CreatedAt = DateTime.Now,
            CheckoutFirstName = first,
            CheckoutLastName = last,
            CheckoutEmail = dto.CheckoutEmail.Trim(),
            CheckoutPhoneNumber = dto.CheckoutPhoneNumber.Trim(),
            OrderItems = orderItemsToAdd,
            RewardOfferingId = dto.RewardOfferingId,
            RewardedMenuItemId = dto.RewardedMenuItemId
        };

        dataContext.Set<Order>().Add(order);

        if (rewardOffering != null)
        {
            user.RewardPoints -= rewardOffering.PointsRequired;

            dataContext.Set<RewardRedemption>().Add(new RewardRedemption
            {
                UserId = user.Id,
                RewardOfferingId = rewardOffering.Id,
                PointsSpent = rewardOffering.PointsRequired,
                RedeemedAt = DateTime.UtcNow
            });
        }

        user.RewardPoints += (int)Math.Floor(order.TotalPrice * 10);

        await userManager.UpdateAsync(user);
        await dataContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapOrderToDto(order));
    }

    [HttpPost("guest")]
    public ActionResult<OrderDto> CreateGuestOrder(CreateGuestOrderDto dto)
    {
        if (dto.LocationId <= 0)
        {
            return BadRequest("Valid LocationId is required");
        }

        if (dto.OrderItems == null || !dto.OrderItems.Any())
        {
            return BadRequest("Order must contain at least one item");
        }

        // Verify location exists
        var locationExists = dataContext.Set<Location>()
            .Any(x => x.Id == dto.LocationId);

        if (!locationExists)
        {
            return BadRequest("Location does not exist");
        }

        // Verify all menu items exist and get prices
        var orderTotal = decimal.Zero;
        var orderItemsToAdd = new List<OrderItem>();

        foreach (var itemDto in dto.OrderItems)
        {
            if (itemDto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            var menuItem = dataContext.Set<Features.MenuItem.MenuItem>()
                .FirstOrDefault(x => x.Id == itemDto.MenuItemId);

            if (menuItem == null)
            {
                return BadRequest($"Menu item {itemDto.MenuItemId} does not exist");
            }

            var unitPrice = OrderPricingHelper.CalculateUnitPrice(
                menuItem.Price,
                itemDto.CustomizationJson
             );

            var itemTotal = unitPrice * itemDto.Quantity;

            orderTotal += itemTotal;

            orderItemsToAdd.Add(new OrderItem
            {
                MenuItemId = itemDto.MenuItemId,
                Quantity = itemDto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = itemTotal,
                CustomizationJson = itemDto.CustomizationJson
            });
        }

        var guestFirst = dto.CheckoutFirstName.Trim();
        var guestLast = dto.CheckoutLastName.Trim();

        var order = new Order
        {
            CustomerName = $"{guestFirst} {guestLast}".Trim(),
            CheckoutFirstName = guestFirst,
            CheckoutLastName = guestLast,
            CheckoutEmail = dto.CheckoutEmail.Trim(),
            CheckoutPhoneNumber = dto.CheckoutPhoneNumber.Trim(),
            LocationId = dto.LocationId,
            TotalPrice = orderTotal,
            Status = "Pending",
            CreatedAt = DateTime.Now,
            OrderItems = orderItemsToAdd
        };

        dataContext.Set<Order>().Add(order);
        dataContext.SaveChanges();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapOrderToDto(order));
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<OrderDto> UpdateOrderStatus(int id, UpdateOrderStatusDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Status))
        {
            return BadRequest("Status is required");
        }

        var validStatuses = new[] { "Pending", "Ready", "Completed", "Cancelled" };
        if (!validStatuses.Contains(dto.Status))
        {
            return BadRequest($"Invalid status. Valid values: {string.Join(", ", validStatuses)}");
        }

        var order = dataContext.Set<Order>()
            .FirstOrDefault(x => x.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        order.Status = dto.Status;

        if (dto.Status == "Completed")
        {
            order.PickedUpAt = DateTime.Now;
        }

        dataContext.SaveChanges();

        return Ok(MapOrderToDto(order));
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
            RewardOfferingId = order.RewardOfferingId,
            RewardedMenuItemId = order.RewardedMenuItemId,
            OrderItems = order.OrderItems.Select(x => new OrderItemDto
            {
                Id = x.Id,
                MenuItemId = x.MenuItemId,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
                TotalPrice = x.TotalPrice,
                CustomizationJson = x.CustomizationJson
            }).ToList()
        };
    }
}
