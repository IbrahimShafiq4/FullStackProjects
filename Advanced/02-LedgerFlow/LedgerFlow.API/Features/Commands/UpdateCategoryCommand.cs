using LedgerFlow.API.Data;
using LedgerFlow.API.Models;
using MediatR;

namespace LedgerFow.API.Features.Commands
{
    public record UpdateCategoryCommand(int Id, string OwnerId, string? Name, string? Type) : IRequest<bool>;

    public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, bool>
    {
        private readonly AppDbContext _context;
        public UpdateCategoryHandler(AppDbContext context) => _context = context;

        public async Task<bool> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(request.Id);
            if (category == null || category.OwnerId != request.OwnerId) return false;

            if (!string.IsNullOrWhiteSpace(request.Name))
                category.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<CategoryType>(request.Type, true, out var type))
                category.Type = type;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}