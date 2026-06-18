namespace FinTrack.Api.DTOs.Ledger;

public class LedgerPostingResponse
{
    public Guid WalletId { get; set; }
    public string Direction { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
}
