using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Testimonials.Commands
{
    public record DeleteTestimonialCommand(int Id, string UserId) : IRequest<bool>;

    public class DeleteTestimonialHandler : IRequestHandler<DeleteTestimonialCommand, bool>
    {
        private readonly IAppDbContext _context;
        public DeleteTestimonialHandler(IAppDbContext context)
        { _context = context; }

        public async Task<bool> Handle(DeleteTestimonialCommand request, CancellationToken cancellationToken)
        {
            var testimonial = await _context.Testimonials
                .Include(t => t.Company)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (testimonial is null) return false;
            if (testimonial.Company.OwnerId != request.UserId) return false;

            _context.Testimonials.Remove(testimonial);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
