using FinTrack.Api.Models;

namespace FinTrack.Api.Services;

public interface IWalletService
{
    Task<Wallet> CreateWalletAsync(Guid userId, string currency, string name, CancellationToken cancellationToken = default);
    Task<List<Wallet>> GetWalletsForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Wallet?> GetWalletByIdAsync(Guid walletId, Guid userId, CancellationToken cancellationToken = default);

    // Resolves a recipient's active wallets in a given currency by email, for building a
    // "send by email" transfer flow without exposing raw wallet ids. Returns null if no
    // user with that email exists, or if they have no active wallet in that currency —
    // these two cases are intentionally indistinguishable to the caller to avoid leaking
    // which emails have an account.
    Task<(string FullName, List<Wallet> Wallets)?> LookupWalletsByEmailAsync(string email, string currency, CancellationToken cancellationToken = default);
    Task<LedgerTransaction> DepositAsync(Guid userId, Guid walletId, decimal amount, CancellationToken cancellationToken = default);

    // Locks the given wallets (FOR UPDATE) in a deterministic, deadlock-safe order.
    // Must be called inside an open DB transaction.
    Task<Dictionary<Guid, Wallet>> LockWalletsAsync(IEnumerable<Guid> walletIds, CancellationToken cancellationToken = default);
}
