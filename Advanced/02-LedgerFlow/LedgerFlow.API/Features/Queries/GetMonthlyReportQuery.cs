using LedgerFlow.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LedgerFlow.API.Features.Queries
{
    public record MonthlySummary(int Month, int Year, decimal TotalRevenue, decimal TotalExpenses, decimal NetBalance);
    public record GetMonthlyReportQuery(string OwnerId, int Year) : IRequest<List<MonthlySummary>>;

    public class GetMonthlyReportHandler: IRequestHandler<GetMonthlyReportQuery, List<MonthlySummary>>
    {
        private readonly AppDbContext _context;

        public GetMonthlyReportHandler(AppDbContext context)
        { _context = context; }

        public async Task<List<MonthlySummary>> Handle(GetMonthlyReportQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _context.Transactions
                                             .Where(t => t.OwnerId == request.OwnerId && t.OccurredAt.Year == request.Year)
                                             .ToListAsync(cancellationToken);

            return transactions
                    .GroupBy(t => t.OccurredAt.Month)
                    .Select(g => new MonthlySummary(
                        g.Key, request.Year,
                        g.Where(t => t.Amount > 0).Sum(t => t.Amount),
                        Math.Abs(g.Where(t => t.Amount < 0).Sum(t => t.Amount)),
                        g.Sum(t => t.Amount)))
                    .OrderBy(s => s.Month)
                    .ToList();
        }
    }
}