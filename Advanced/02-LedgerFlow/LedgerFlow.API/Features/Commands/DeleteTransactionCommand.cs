using LedgerFlow.API.Data;
using MediatR;

namespace LedgerFow.API.Features.Commands
{
    public record DeleteTransactionCommand(int Id, string OwnerId) : IRequest<bool>;

    public class DeleteTransactionHandler : IRequestHandler<DeleteTransactionCommand, bool>
    {
        private readonly AppDbContext _context;
        public DeleteTransactionHandler(AppDbContext context) => _context = context;

        public async Task<bool> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _context.Transactions.FindAsync(request.Id);
            if (transaction == null || transaction.OwnerId != request.OwnerId) return false;

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}