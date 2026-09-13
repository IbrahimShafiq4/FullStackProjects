using LedgerFlow.API.Data;
using MediatR;

namespace LedgerFow.API.Features.Commands
{
    public record UpdateTransactionCommand(int Id, string OwnerId, int? CategoryId, decimal? Amount, string? Description, DateTime? OccurredAt) : IRequest<bool>;

    public class UpdateTransactionHandler : IRequestHandler<UpdateTransactionCommand, bool>
    {
        private readonly AppDbContext _context;
        public UpdateTransactionHandler(AppDbContext context) => _context = context;

        public async Task<bool> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FindAsync(request.Id);
            if (transaction == null || transaction.OwnerId != request.OwnerId) return false;

            if (request.CategoryId.HasValue)
                transaction.CategoryId = request.CategoryId.Value;
            if (request.Amount.HasValue)
                transaction.Amount = request.Amount.Value;
            if (request.Description != null)
                transaction.Description = request.Description;
            if (request.OccurredAt.HasValue)
                transaction.OccurredAt = request.OccurredAt.Value;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}