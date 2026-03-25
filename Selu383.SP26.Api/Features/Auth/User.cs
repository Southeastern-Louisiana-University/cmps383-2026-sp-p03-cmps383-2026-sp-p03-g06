using Microsoft.AspNetCore.Identity;

namespace Selu383.SP26.Api.Features.Auth;

public class User : IdentityUser<int>
{
    public string? Address { get; set; }
    
    public int? PreferredLocationId { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}