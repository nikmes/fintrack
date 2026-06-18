using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
