namespace FinTrack.Api.DTOs.Wallets;

public class TransferRequest
{
    public Guid SourceWalletId { get; set; }
    public Guid DestinationWalletId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string? Description { get; set; }
}
