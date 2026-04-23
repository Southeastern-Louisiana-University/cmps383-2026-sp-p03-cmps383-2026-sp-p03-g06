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

        await AddCategories(dataContext);
        await AddMenuItems(dataContext);

        await AddLocations(dataContext);

        await AddOrders(dataContext);



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
        var existing = await dataContext.Set<Location>().ToListAsync();
        dataContext.Set<Location>().RemoveRange(existing);


        dataContext.Set<Location>().AddRange(
            new Location
            {
                Name = "Location 1",
                Address = "123 Main St",
                TableCount = 10,
                HoursOfOperation = "Mon-Fri: 7:00 AM - 9:00 PM | Sat-Sun: 8:00 AM - 8:00 PM"
            },
            new Location
            {
                Name = "Location 2",
                Address = "456 Oak Ave",
                TableCount = 20,
                HoursOfOperation = "Mon-Sun: 6:00 AM - 10:00 PM"
            },
            new Location
            {
                Name = "Location 3",
                Address = "789 Pine Ln",
                TableCount = 15,
                HoursOfOperation = "Mon-Thu: 7:00 AM - 8:00 PM | Fri-Sat: 7:00 AM - 10:00 PM | Sun: Closed"
            }
        );

        await dataContext.SaveChangesAsync();
    }
    private static async Task AddCategories(DataContext dataContext)
    {
        var existing = await dataContext.Set<Category>().ToListAsync();
        dataContext.Set<Category>().RemoveRange(existing);

        dataContext.Set<Category>().AddRange(
            new Category { Name = "Drinks" },
            new Category { Name = "Sweet Crepes" },
            new Category { Name = "Savory Crepes"},
            new Category { Name = "Bagels" }
        );

        await dataContext.SaveChangesAsync();
    }
    private static async Task AddMenuItems(DataContext dataContext)
    {
        var existing = await dataContext.Set<MenuItem>().ToListAsync();
        dataContext.Set<MenuItem>().RemoveRange(existing);


        dataContext.Set<MenuItem>().AddRange(
            new MenuItem {Name = "Iced Latte", Description = "Expresso and milk served over ice for a refreshing coffee drink.", Price = 5.50m,IsAvailable = true, CategoryId = 29},
            new MenuItem {Name = "Supernova", Description = "A unique coffee blend with a complex, balanced profile and subtle sweetness. Delicious as espresso or paired with milk.", Price = 7.95m, IsAvailable = true, CategoryId = 29 },
            new MenuItem {Name = "Roaring Frappe", Description = "Cold brew, milk, and ice blended together with a signature syrup or flavor, topped with whipped cream.", Price = 6.20m, IsAvailable = true, CategoryId = 29 },
            new MenuItem { Name = "Black & White Cold Brew", Description = "Cold brew made with both dark and light roast beans, finished with a drizzle of condensed milk.", Price = 5.15m, IsAvailable = true, CategoryId = 29 },
            new MenuItem { Name = "Strawberry Limeade", Description = "Fresh lime juice blended with strawberry puree for a refreshing, tangy drink.", Price = 5.00m, IsAvailable = true, CategoryId = 29 },
            new MenuItem { Name = "Shaken Lemonade", Description = "Fresh lemon juice and simple syrup vigorously shaken for a bright, refreshing lemonade.", Price = 5.00m, IsAvailable = true, CategoryId = 29 },

            new MenuItem { Name = "Mannino Honey Crepe", Description = "A sweet crepe drizzled with Mannino honey and topped with mixed berries.", Price = 10.00m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Downtowner", Description = "Strawberries and bananas wrapped in a crepe, finished with Nutella and Hershey's chocolate sauce.", Price = 10.75m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Funky Monkey", Description = "Nutella and bananas wrapped in a crepe, served with whipped cream.", Price = 10.00m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Le S'mores", Description = "Marshmallow cream and chocolate sauce inside a crepe, topped with graham cracker crumbs.", Price = 9.50m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Strawberry Fields", Description = "Fresh strawberries with Hershey's chocolate drizzle and a dusting of powdered sugar.", Price = 10.00m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Bonjour", Description = "A sweet crepe filled with syrup and cinnamon, finished with powdered sugar.", Price = 8.50m, IsAvailable = true, CategoryId = 30 },
            new MenuItem { Name = "Banana Foster", Description = "Bananas with cinnamon in a crepe, topped with a generous drizzle of caramel sauce.", Price = 8.95m, IsAvailable = true, CategoryId = 30 },

            new MenuItem { Name = "Matt's Scrambled Eggs", Description = "Scrambled eggs and melted mozzarella cheese wrapped in a crepe.", Price = 5.00m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Meanie Mushroom", Description = "Sautéed mushrooms, mozzarella, tomato, and bacon inside a delicate crepe.", Price = 10.50m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Turkey Club", Description = "Sliced turkey, bacon, spinach, and tomato wrapped in a savory crepe.", Price = 10.50m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Green Machine", Description = "Spinach, artichokes, and mozzarella cheese inside a fresh crepe.", Price = 10.00m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Perfect Pair", Description = "A unique combination of bacon and Nutella wrapped in a crepe.", Price = 10.00m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Crepe Fromage", Description = "A savory crepe filled with a blend of cheeses.", Price = 8.00m, IsAvailable = true, CategoryId = 31 },
            new MenuItem { Name = "Farmers Market Crepe", Description = "Turkey, spinach, and mozzarella wrapped in a savory crepe.", Price = 10.50m, IsAvailable = true, CategoryId = 31 },

            new MenuItem { Name = "Travis Special", Description = "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel.", Price = 14.00m, IsAvailable = true, CategoryId = 32 },
            new MenuItem { Name = "Crème Brulagel", Description = "A toasted bagel with a caramelized sugar crust inspired by crème brûlée, served with creamcheese.", Price = 8.00m, IsAvailable = true, CategoryId = 32 },
            new MenuItem { Name = "The Fancy One", Description = "Smoked salmon, cream cheese, and fresh dill on a toasted bagel.", Price = 13.00m, IsAvailable = true, CategoryId = 32 },
            new MenuItem { Name = "Breakfast Bagel", Description = "A toasted bagel with your choice of ham, bacon, or sausage, a fried egg, and cheddar cheese.", Price = 9.50m, IsAvailable = true, CategoryId = 32 },
            new MenuItem { Name = "The Classic", Description = "A toasted bagel with cream cheeese", Price = 5.25m, IsAvailable = true, CategoryId = 32 }



            );

        await dataContext.SaveChangesAsync();
    }

    private static async Task AddRewards(DataContext dataContext)
{
        var existing = await dataContext.Set<RewardOffering>().ToListAsync();
        dataContext.Set<RewardOffering>().RemoveRange(existing);

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
        var existing = await dataContext.Set<Order>().ToListAsync();
        dataContext.Set<Order>().RemoveRange(existing);


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
                CustomerName = "Bob Smith",
                CheckoutFirstName = "Bob",
                CheckoutLastName = "Smith",
                CheckoutEmail = "bob@example.com",
                CheckoutPhoneNumber = "9855550100",
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
                CustomerName = "Sue Jones",
                CheckoutFirstName = "Sue",
                CheckoutLastName = "Jones",
                CheckoutEmail = "sue@example.com",
                CheckoutPhoneNumber = "9855550101",
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
                CheckoutFirstName = "John",
                CheckoutLastName = "Guest",
                CheckoutEmail = "john.guest@example.com",
                CheckoutPhoneNumber = "9855550199",
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
