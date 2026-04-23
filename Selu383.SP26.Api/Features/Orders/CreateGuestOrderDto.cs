using System.ComponentModel.DataAnnotations;

namespace Selu383.SP26.Api.Features.Orders;

public class CreateGuestOrderDto
{
    [Required]
    [MaxLength(80)]
    public string CheckoutFirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string CheckoutLastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string CheckoutEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string CheckoutPhoneNumber { get; set; } = string.Empty;

    public int LocationId { get; set; }

    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}
