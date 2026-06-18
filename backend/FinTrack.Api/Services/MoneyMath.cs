namespace FinTrack.Api.Services;

public static class MoneyMath
{
    public static long ToMinorUnits(decimal amount)
    {
        if (amount != Math.Round(amount, 2))
            throw new ArgumentException("Amount cannot have more than 2 decimal places.", nameof(amount));

        return (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);
    }
}
