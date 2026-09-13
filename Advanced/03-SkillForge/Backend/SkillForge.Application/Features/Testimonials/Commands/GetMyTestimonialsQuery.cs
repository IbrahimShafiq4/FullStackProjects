using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Testimonials.Commands
{
    public record GetMyTestimonialsQuery(string UserId) : IRequest<List<TestimonialDto>>;

    public class GetMyTestimonialsHandler : IRequestHandler<GetMyTestimonialsQuery, List<TestimonialDto>>
    {
        private readonly IAppDbContext _context;
        public GetMyTestimonialsHandler(IAppDbContext context)
        { _context = context; }

        public async Task<List<TestimonialDto>> Handle(GetMyTestimonialsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Testimonials
                .Include(t => t.Company)
                .Where(t => t.Company.OwnerId == request.UserId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TestimonialDto(
                    t.Id,
                    t.AuthorName,
                    t.AuthorRole,
                    t.Message,
                    t.Rating,
                    t.CreatedAt,
                    t.Company.Name
                ))
                .ToListAsync(cancellationToken);
        }
    }
}
