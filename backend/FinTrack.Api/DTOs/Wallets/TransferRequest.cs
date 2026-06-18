using System.ComponentModel.DataAnnotations;

namespace FinTrack.Api.DTOs.Wallets;

public class TransferRequest
{
    public Guid SourceWalletId { get; set; }
    public Guid DestinationWalletId { get; set; }
    public decimal Amount { get; set; }

    [Required]
    public string Currency { get; set; } = null!;

    public string? Description { get; set; }
}
