namespace FinTrack.Api.DTOs.Users;

public class LoginResponse
{
    public UserResponse User { get; set; } = null!;
    public string Token { get; set; } = null!;
}
