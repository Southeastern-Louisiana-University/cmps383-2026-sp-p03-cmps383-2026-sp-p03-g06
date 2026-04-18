using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;
using Selu383.SP26.Api.Features.Orders;
using Selu383.SP26.Api.Features.MenuItem;
using Selu383.SP26.Api.Migrations;
using Selu383.SP26.Api.Features.Rewards;
using Selu383.SP26.Api.Features.Categories;

namespace Selu383.SP26.Api.Data;

public static class SeedHelper
{
    public static async Task MigrateAndSeed(IServiceProvider serviceProvider)
    {
        var dataContext = serviceProvider.GetRequiredService<DataContext>();

        await dataContext.Database.MigrateAsync();

        await AddRoles(serviceProvider);
        await AddUsers(serviceProvider);
        await AddRewards(dataContext);

        await AddLocations(dataContext);
        await AddOrders(dataContext);
        await AddCategories(dataContext);
        await AddMenuItems(dataContext);
    }

    private static async Task AddUsers(IServiceProvider serviceProvider)
    {
        const string defaultPassword = "Password123!";
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        if (userManager.Users.Any())
        {
            return;
        }

        var adminUser = new User
        {
            UserName = "galkadi"
        };
        await userManager.CreateAsync(adminUser, defaultPassword);
        await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);

        var bob = new User
        {
            UserName = "bob"
        };
        await userManager.CreateAsync(bob, defaultPassword);
        await userManager.AddToRoleAsync(bob, RoleNames.User);

        var sue = new User
        {
            UserName = "sue"
        };
        await userManager.CreateAsync(sue, defaultPassword);
        await userManager.AddToRoleAsync(sue, RoleNames.User);
    }

    private static async Task AddRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        if (roleManager.Roles.Any())
        {
            return;
        }
        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.Admin
        });

        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.User
        });
    }

    private static async Task AddLocations(DataContext dataContext)
    {
        dataContext.Set<Location>().AddRange(
            new Location { Name = "Location 1", Address = "123 Main St", TableCount = 10 },
            new Location { Name = "Location 2", Address = "456 Oak Ave", TableCount = 20 },
            new Location { Name = "Location 3", Address = "789 Pine Ln", TableCount = 15 }
        );

        await dataContext.SaveChangesAsync();
    }
    private static async Task AddCategories(DataContext dataContext)
    {
        dataContext.Set<Category>().AddRange(
            new Category { Name = "Lattes" },
            new Category { Name = "Espressos" },
            new Category { Name = "Machas"}
        );

        await dataContext.SaveChangesAsync();
    }
    private static async Task AddMenuItems(DataContext dataContext)
    {
        dataContext.Set<MenuItem>().AddRange(
            new MenuItem {Name = "Drink 1", Description = "Drink 1 Description", Price = 9.99m,IsAvailable = true, CategoryId = 1},
            new MenuItem {Name = "Drink 2", Description = "Drink 2 Description", Price = 12.99m, IsAvailable = true, CategoryId = 2 },
            new MenuItem {Name = "Drink 3", Description = "Drink 3 Description", Price = 11.99m, IsAvailable = true, CategoryId = 3 }
        );

        await dataContext.SaveChangesAsync();
    }

    private static async Task AddRewards(DataContext dataContext)
{
    if (dataContext.Set<RewardOffering>().Any())
    {
        return;
    }

    dataContext.Set<RewardOffering>().AddRange(
        new RewardOffering
        {
            Name = "Free Drip Coffee",
            Description = "Redeem for one free drip coffee.",
            PointsRequired = 25,
            IsActive = true
        },
        new RewardOffering
        {
            Name = "Free Pastry",
            Description = "Redeem for one free pastry item.",
            PointsRequired = 40,
            IsActive = true
        },
        new RewardOffering
        {
            Name = "Free Specialty Drink",
            Description = "Redeem for one free specialty drink.",
            PointsRequired = 75,
            IsActive = true
        }
    );

    await dataContext.SaveChangesAsync();
}

    private static async Task AddOrders(DataContext dataContext)
    {
        if (dataContext.Set<Order>().Any())
        {
            return;
        }

        var users = dataContext.Set<User>().Where(u => u.UserName != "galkadi").ToList();
        var locations = dataContext.Set<Location>().ToList();
        var menuItems = dataContext.Set<MenuItem>().ToList();

        if (!users.Any() || !locations.Any() || !menuItems.Any())
        {
            return;
        }

        var orders = new List<Order>();

        // Order 1: Bob's order - 2 items
        if (users.FirstOrDefault(u => u.UserName == "bob") is var bob && bob != null && menuItems.Count >= 2)
        {
            var order1 = new Order
            {
                CustomerId = bob.Id,
                LocationId = locations[0].Id,
                Status = "Completed",
                CreatedAt = DateTime.Now.AddDays(-5),
                PickedUpAt = DateTime.Now.AddDays(-5).AddHours(1),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        MenuItemId = menuItems[0].Id,
                        Quantity = 2,
                        UnitPrice = menuItems[0].Price,
                        TotalPrice = menuItems[0].Price * 2
                    },
                    new OrderItem
                    {
                        MenuItemId = menuItems[1].Id,
                        Quantity = 1,
                        UnitPrice = menuItems[1].Price,
                        TotalPrice = menuItems[1].Price
                    }
                }
            };
            order1.TotalPrice = order1.OrderItems.Sum(oi => oi.TotalPrice);
            orders.Add(order1);
        }

        // Order 2: Sue's order - 1 item
        if (users.FirstOrDefault(u => u.UserName == "sue") is var sue && sue != null && menuItems.Count >= 1)
        {
            var order2 = new Order
            {
                CustomerId = sue.Id,
                LocationId = locations[1].Id,
                Status = "Ready",
                CreatedAt = DateTime.Now.AddHours(-2),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        MenuItemId = menuItems[0].Id,
                        Quantity = 1,
                        UnitPrice = menuItems[0].Price,
                        TotalPrice = menuItems[0].Price
                    }
                }
            };
            order2.TotalPrice = order2.OrderItems.Sum(oi => oi.TotalPrice);
            orders.Add(order2);
        }

        // Order 3: Guest order
        if (menuItems.Count >= 1)
        {
            var order3 = new Order
            {
                CustomerName = "John Guest",
                LocationId = locations[2].Id,
                Status = "Pending",
                CreatedAt = DateTime.Now.AddMinutes(-30),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        MenuItemId = menuItems[0].Id,
                        Quantity = 3,
                        UnitPrice = menuItems[0].Price,
                        TotalPrice = menuItems[0].Price * 3
                    }
                }
            };
            order3.TotalPrice = order3.OrderItems.Sum(oi => oi.TotalPrice);
            orders.Add(order3);
        }

        if (orders.Any())
        {
            dataContext.Set<Order>().AddRange(orders);
            await dataContext.SaveChangesAsync();
        }
    }
}
