namespace Selu383.SP26.Api.Features.Orders;

public class CreateOrderDto
{
    public int LocationId { get; set; }

    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}
