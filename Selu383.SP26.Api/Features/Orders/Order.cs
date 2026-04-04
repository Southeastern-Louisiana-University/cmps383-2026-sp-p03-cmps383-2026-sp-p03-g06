namespace Selu383.SP26.Api.Features.Orders;

public class Order
{
    public int Id { get; set; }

    public int? CustomerId { get; set; }

    public string? CustomerName { get; set; }

    public int LocationId { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? PickedUpAt { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();
}
