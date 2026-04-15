namespace Selu383.SP26.Api.Features.Auth;

public class ProfileDto
{
    public int Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public int? PreferredLocationId { get; set; }

    public List<string> Roles { get; set; } = new();

    public int OrderCount { get; set; }
}
