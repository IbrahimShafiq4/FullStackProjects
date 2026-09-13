using EventHive.Application.DTOs.Events;
using EventHive.Application.DTOs.Landing;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Interfaces
{
    public interface ILandingService
    {
        Task<LandingStatsDto>               GetStatsAsync();
        Task<IEnumerable<EventDto>>         GetFeaturedEventsAsync(int count);
        Task<IEnumerable<TestimonialDto>>   GetTestimonialsAsync();
        Task<IEnumerable<CategoryDto>>      GetCategoriesAsync();
    }
}
