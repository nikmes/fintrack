namespace FinTrack.Api.DTOs.Ledger;

public class LedgerTransactionResponse
{
    public Guid Id { get; set; }
    public string Type { get; set; } = null!;
    public string Status { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public Guid SourceWalletId { get; set; }
    public Guid DestinationWalletId { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<LedgerPostingResponse> Postings { get; set; } = new();
}
