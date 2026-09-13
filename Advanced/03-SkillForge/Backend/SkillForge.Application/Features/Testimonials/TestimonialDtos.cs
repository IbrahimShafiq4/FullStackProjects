using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Testimonials
{
    public record CreateTestimonialRequest(
            string AuthorName,
            string AuthorRole,
            string Message,
            int Rating
        );

    public record TestimonialDto(
        int Id,
        string AuthorName,
        string AuthorRole,
        string Message,
        int Rating,
        DateTime CreatedAt,
        string? CompanyName
    );
}
