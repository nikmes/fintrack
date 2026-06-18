using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface ITransferService
{
    Task<LedgerTransaction> TransferAsync(
        Guid currentUserId,
        Guid sourceWalletId,
        Guid destinationWalletId,
        decimal amount,
        string currency,
        string? description,
        CancellationToken cancellationToken = default);
}
