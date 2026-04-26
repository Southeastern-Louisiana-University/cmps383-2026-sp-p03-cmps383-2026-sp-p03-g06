using System.Text.Json;

namespace Selu383.SP26.Api.Features.Orders;

public static class OrderPricingHelper
{
    public static decimal CalculateCustomizationUpcharge(string? customizationJson)
    {
        if (string.IsNullOrWhiteSpace(customizationJson))
        {
            return 0m;
        }

        using var doc = JsonDocument.Parse(customizationJson);
        var root = doc.RootElement;

        decimal upcharge = 0m;

        if (root.TryGetProperty("drinkSize", out var drinkSize))
        {
            var size = drinkSize.GetString();

            if (size == "medium") upcharge += 0.50m;
            else if (size == "large") upcharge += 1.00m;
        }

        if (root.TryGetProperty("milkType", out var milkType))
        {
            var milk = milkType.GetString();

            if (milk == "oat") upcharge += 0.70m;
            else if (milk == "almond") upcharge += 0.70m;
            else if (milk == "soy") upcharge += 0.50m;
        }

        if (root.TryGetProperty("shotCount", out var shotCount))
        {
            var shots = shotCount.GetInt32();
            upcharge += shots * 0.50m;
        }

        if (root.TryGetProperty("temperature", out var temperature))
        {
            var temp = temperature.GetString();

            if (temp == "warm" || temp == "chilled")
            {
                upcharge += 0.50m;
            }
        }

        if (root.TryGetProperty("filling", out var filling) &&
            filling.GetString() != "none")
        {
            upcharge += 0.50m;
        }

        if (root.TryGetProperty("topping", out var topping) &&
            topping.GetString() != "none")
        {
            upcharge += 0.50m;
        }

        if (root.TryGetProperty("protein", out var protein))
        {
            var proteinValue = protein.GetString();

            if (proteinValue == "bacon") upcharge += 1.50m;
            else if (proteinValue == "ham") upcharge += 2.00m;
            else if (proteinValue == "egg") upcharge += 1.50m;
        }

        if (root.TryGetProperty("cheese", out var cheese) &&
            cheese.GetString() != "none")
        {
            upcharge += 1.00m;
        }

        if (root.TryGetProperty("veggy", out var veggy) &&
            veggy.GetString() != "none")
        {
            upcharge += 0.50m;
        }

        return upcharge;
    }

    public static decimal CalculateUnitPrice(decimal basePrice, string? customizationJson)
    {
        return basePrice + CalculateCustomizationUpcharge(customizationJson);
    }

    public static decimal CalculateItemTotal(
        decimal basePrice,
        int quantity,
        string? customizationJson)
    {
        var unitPrice = CalculateUnitPrice(basePrice, customizationJson);
        return unitPrice * quantity;
    }
}