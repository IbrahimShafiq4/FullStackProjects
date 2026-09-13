using AutoMapper;
using EventHive.Application.DTOs.Events;
using EventHive.Application.DTOs.Landing;
using EventHive.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Services
{
    public class LandingService : ILandingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEventRepository _events;

        public LandingService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _events = unitOfWork.EventsRepository;
        }

        public async Task<LandingStatsDto> GetStatsAsync()
        {
            var allEvents = (await _events.GetAllAsync()).ToList();
            var upcoming = (await _events.GetUpcomingEventsAsync()).ToList();

            var totalRsvps = allEvents.Sum(e => e.Rsvps?.Count ?? 0);

            var cities = allEvents
                .Where(e => !string.IsNullOrWhiteSpace(e.Location))
                .Select(e => e.Location!.Split(',').First().Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Count();

            var organizers = allEvents
                .Select(e => e.OrganizerId)
                .Where(id => !string.IsNullOrEmpty(id))
                .Distinct()
                .Count();

            return new LandingStatsDto
            {
                TotalEvents = allEvents.Count,
                TotalAttendees = totalRsvps,
                TotalOrganizers = organizers,
                TotalCities = cities,
                UpcomingEvents = upcoming.Count,
                TotalRsvps = totalRsvps
            };
        }

        public async Task<IEnumerable<EventDto>> GetFeaturedEventsAsync(int count)
        {
            var upcoming = (await _events.GetUpcomingEventsAsync()).Take(count);
            return _mapper.Map<IEnumerable<EventDto>>(upcoming);
        }

        public Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync()
        {
            var data = new List<TestimonialDto>
            {
                new() { Name = "سارة أحمد", Role = "منظمة فعاليات", Message = "EventHive غيّرت طريقة تنظيمي للفعاليات بشكل كامل. الأداة سهلة ومتكاملة ومصممة بعناية.", Avatar = "س", Rating = 5 },
                new() { Name = "محمد علي", Role = "حضور دائم", Message = "أفضل تجربة حجز فعاليات مررت بها. سريعة وواضحة وممتعة من أول ضغطة.", Avatar = "م", Rating = 5 },
                new() { Name = "ليلى إبراهيم", Role = "مديرة تسويق", Message = "التقارير والتحليلات ساعدتنا نفهم جمهورنا بشكل أعمق، واتخذنا قرارات أفضل.", Avatar = "ل", Rating = 5 },
                new() { Name = "خالد يوسف", Role = "منظم ورش", Message = "أقدر أنشئ فعالية وأنشرها في دقائق. تجربة ممتازة ما لقيت زيها.", Avatar = "خ", Rating = 5 },
                new() { Name = "نورة السالم", Role = "طالبة جامعية", Message = "لقيت فعاليات تقنية قريبة مني ما كنت أعرف عنها. شكراً EventHive.", Avatar = "ن", Rating = 5 }
            };
            return Task.FromResult<IEnumerable<TestimonialDto>>(data);
        }

        public Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
        {
            var categories = new List<CategoryDto>
            {
                new() { Name = "مؤتمرات", Icon = "🎤", Description = "لقاءات احترافية وقمم متخصصة", EventCount = 42 },
                new() { Name = "ورش عمل", Icon = "🛠️", Description = "جلسات عملية وتدريب مباشر", EventCount = 68 },
                new() { Name = "موسيقى", Icon = "🎵", Description = "حفلات وعروض موسيقية حية", EventCount = 25 },
                new() { Name = "تقنية", Icon = "💻", Description = "هاكاثونات وميتابات تقنية", EventCount = 53 },
                new() { Name = "رياضة", Icon = "⚽", Description = "بطولات وفعاليات رياضية", EventCount = 31 },
                new() { Name = "فنون", Icon = "🎨", Description = "معارض وورش إبداعية", EventCount = 19 },
                new() { Name = "طعام", Icon = "🍽️", Description = "مهرجانات ومذاقات", EventCount = 12 },
                new() { Name = "تعليم", Icon = "📚", Description = "دورات ومحاضرات ومحتوى معرفي", EventCount = 47 }
            };
            return Task.FromResult<IEnumerable<CategoryDto>>(categories);
        }
    }
}
