using LedgerFlow.API.Data;
using LedgerFlow.API.Models;
using MediatR;

namespace LedgerFow.API.Features.Commands
{
    public record RecordTransactionCommand(string OwnerId, int CategoryId, decimal Amount, string Description): IRequest<int>;

    public class RecordTransactionHandler: IRequestHandler<RecordTransactionCommand, int>
    {
        private readonly AppDbContext _context;
        public RecordTransactionHandler(AppDbContext context)
        { _context = context; }

        public async Task<int> Handle(RecordTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = new Transaction
            {
                OwnerId     = request.OwnerId,
                CategoryId  = request.CategoryId,
                Amount      = request.Amount,
                Description = request.Description,
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);
            return transaction.Id;
        }
    }
}