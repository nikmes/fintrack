namespace FinTrack.Api.DTOs.Wallets;

public class WalletLookupResponse
{
    public string FullName { get; set; } = null!;
    public List<WalletSummaryResponse> Wallets { get; set; } = new();
}
