namespace Selu383.SP26.Api.Features.Orders;

public class CreateOrderItemDto
{
    public int MenuItemId { get; set; }

    public int Quantity { get; set; }

    public string? CustomizationJson { get; set; }
}
