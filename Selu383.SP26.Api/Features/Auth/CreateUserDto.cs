using System.ComponentModel.DataAnnotations;

namespace Selu383.SP26.Api.Features.Auth;

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public string[] Roles { get; set; } = Array.Empty<string>();
}