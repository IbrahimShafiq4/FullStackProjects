using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Testimonials.Commands
{
    public record GetPublishedTestimonialsQuery(int Take = 12) : IRequest<List<TestimonialDto>>;

    public class GetPublishedTestimonialsHandler : IRequestHandler<GetPublishedTestimonialsQuery, List<TestimonialDto>>
    {
        private readonly IAppDbContext _context;
        public GetPublishedTestimonialsHandler(IAppDbContext context)
        { _context = context; }

        public async Task<List<TestimonialDto>> Handle(GetPublishedTestimonialsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Testimonials
                .Where(t => t.IsPublished)
                .OrderByDescending(t => t.CreatedAt)
                .Take(request.Take)
                .Include(t => t.Company)
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
