using System.Security.Claims;

namespace FinTrack.Api.Auth;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (value is null || !Guid.TryParse(value, out var userId))
            throw new InvalidOperationException("Request is missing a valid user identity claim.");

        return userId;
    }
}
