using StreamVault.Domain.Domain;
namespace StreamVault.Domain.Services
{
    public interface ISubscriptionValidator { bool IsActive(Subscription subscription, DateTime now); }

    public class SubscriptionValidator : ISubscriptionValidator
    {
        public bool IsActive(Subscription subscription, DateTime now)
        {
            var expiryDate = subscription.StartedAt.AddDays(subscription.DurationDays);
            return now <= expiryDate;
        }
    }
}