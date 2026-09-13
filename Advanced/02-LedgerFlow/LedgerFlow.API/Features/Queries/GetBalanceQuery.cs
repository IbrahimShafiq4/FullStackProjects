using LedgerFlow.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LedgerFlow.API.Features.Queries
{
    public record GetBalanceQuery(string OwnerId) : IRequest<decimal>;

    public class GetBalanceHandler: IRequestHandler<GetBalanceQuery, decimal>
    {
        private readonly AppDbContext _context;
        public GetBalanceHandler(AppDbContext context)
        { _context = context; }

        public async Task<decimal> Handle(GetBalanceQuery request, CancellationToken cancellationToken) =>
            await _context.Transactions
                          .Where(t => t.OwnerId == request.OwnerId)
                          .SumAsync(t => t.Amount, cancellationToken);
    }
}