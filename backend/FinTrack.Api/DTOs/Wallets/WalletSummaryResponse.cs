namespace FinTrack.Api.DTOs.Wallets;

public class WalletSummaryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Currency { get; set; } = null!;
}
