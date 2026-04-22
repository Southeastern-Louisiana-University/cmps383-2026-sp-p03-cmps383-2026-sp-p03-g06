namespace Selu383.SP26.Api.Features.Payments;

public class SavedPaymentMethod
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string CardholderName { get; set; } = string.Empty;

    public string CardLast4 { get; set; } = string.Empty;

    public string CardType { get; set; } = string.Empty;

    public int ExpiryMonth { get; set; }

    public int ExpiryYear { get; set; }

    public bool IsDefault { get; set; }
}
