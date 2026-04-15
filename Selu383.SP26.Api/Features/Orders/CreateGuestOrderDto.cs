namespace Selu383.SP26.Api.Features.Orders;

public class CreateGuestOrderDto
{
    public string CustomerName { get; set; } = string.Empty;

    public int LocationId { get; set; }

    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}
