namespace Selu383.SP26.Api.Features.Orders;

public class OrderDto
{
    public int Id { get; set; }

    public int? CustomerId { get; set; }

    public string? CustomerName { get; set; }

    public string? CheckoutFirstName { get; set; }

    public string? CheckoutLastName { get; set; }

    public string? CheckoutEmail { get; set; }

    public string? CheckoutPhoneNumber { get; set; }

    public int LocationId { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? PickedUpAt { get; set; }

    public List<OrderItemDto> OrderItems { get; set; } = new();
}
