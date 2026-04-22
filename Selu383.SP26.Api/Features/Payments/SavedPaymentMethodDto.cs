using System.ComponentModel.DataAnnotations;

namespace Selu383.SP26.Api.Features.Payments;

public class SavedPaymentMethodDto
{
    public int Id { get; set; }

    [Required]
    public string CardholderName { get; set; } = string.Empty;

    [Required]
    [StringLength(4, MinimumLength = 4)]
    public string CardLast4 { get; set; } = string.Empty;

    [Required]
    public string CardType { get; set; } = string.Empty;

    [Range(1, 12)]
    public int ExpiryMonth { get; set; }

    [Range(2024, 2099)]
    public int ExpiryYear { get; set; }

    public bool IsDefault { get; set; }
}
