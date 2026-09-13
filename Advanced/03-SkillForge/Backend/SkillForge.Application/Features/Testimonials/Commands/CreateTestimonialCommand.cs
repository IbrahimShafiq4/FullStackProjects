using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Testimonials.Commands
{
    public record CreateTestimonialCommand(
            string UserId,
            string AuthorName,
            string AuthorRole,
            string Message,
            int Rating
        ) : IRequest<int>;

    public class CreateTestimonialHandler : IRequestHandler<CreateTestimonialCommand, int>
    {
        private readonly IAppDbContext _context;
        public CreateTestimonialHandler(IAppDbContext context)
        { _context = context; }

        public async Task<int> Handle(CreateTestimonialCommand request, CancellationToken cancellationToken)
        {
            var company = await _context.Companies
                                .FirstOrDefaultAsync(c => c.OwnerId == request.UserId, cancellationToken)
                                ?? throw new InvalidOperationException("يجب إنشاء شركة أولا");

            var testimonial = new Testimonial
            {
                CompanyId = company.Id,
                AuthorName = request.AuthorName.Trim(),
                AuthorRole = request.AuthorRole.Trim(),
                Message = request.Message.Trim(),
                Rating = Math.Clamp(request.Rating, 1, 5),
                IsPublished = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Testimonials.Add(testimonial);
            await _context.SaveChangesAsync(cancellationToken);
            return testimonial.Id;
        }
    }
}
