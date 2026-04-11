namespace Selu383.SP26.Api.Features.Auth;

public class UpdateProfileDto
{
    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public int? PreferredLocationId { get; set; }
}
