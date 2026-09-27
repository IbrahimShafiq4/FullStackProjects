using EventSphere.Application.Features.Landing;
using EventSphere.Application.Interfaces;
using EventSphere.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LandingController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IPriceCalculator _priceCalculator;

        public LandingController(IAppDbContext context, IPriceCalculator priceCalculator)
        {
            _context = context;
            _priceCalculator = priceCalculator;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<LandingStatsDto>> GetStats()
        {
            var now = DateTime.UtcNow;

            var totalEvents = await _context.Events.CountAsync();
            var totalVenues = await _context.Venues.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync(b => b.Status == BookingStatus.Confirmed);
            var totalAttendees = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed)
                .Select(b => b.AttendeeId)
                .Distinct()
                .CountAsync();
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed)
                .SumAsync(b => (decimal?)b.FinalPrice) ?? 0m;
            var upcomingEvents = await _context.Events.CountAsync(e => e.EventDate > now);

            return Ok(new LandingStatsDto(
                totalEvents,
                totalVenues,
                totalBookings,
                totalAttendees,
                totalRevenue,
                upcomingEvents
            ));
        }

        [HttpGet("featured-events")]
        public async Task<ActionResult<IEnumerable<FeaturedEventDto>>> GetFeaturedEvents([FromQuery] int take = 6)
        {
            var now = DateTime.UtcNow;

            var events = await _context.Events
                .Include(e => e.Venue)
                .Include(e => e.Seats)
                .Where(e => e.EventDate > now)
                .OrderBy(e => e.EventDate)
                .Take(take)
                .ToListAsync();

            var organizerIds = events.Select(e => e.OrganizerId).Distinct().ToList();
            var organizers = await _context.Users
                .Where(u => organizerIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Email ?? "منظم");

            var result = events.Select(e =>
            {
                var totalSeats = e.Seats.Count;
                var bookedSeats = e.Seats.Count(s => s.Status == SeatStatus.Booked);

                return new FeaturedEventDto(
                    e.Id,
                    e.Title,
                    e.EventDate,
                    _priceCalculator.CalculateFinalPrice(e.BasePrice, e.EventDate),
                    e.Venue.Name,
                    e.Venue.Address,
                    totalSeats,
                    bookedSeats,
                    totalSeats - bookedSeats,
                    organizers.TryGetValue(e.OrganizerId, out var name) ? name : "منظم"
                );
            }).ToList();

            return Ok(result);
        }

        [HttpGet("venues")]
        public async Task<ActionResult<IEnumerable<VenueCardDto>>> GetVenues([FromQuery] int take = 6)
        {
            var venues = await _context.Venues
                .Include(v => v.Events)
                .OrderByDescending(v => v.Events.Count)
                .Take(take)
                .ToListAsync();

            var result = venues.Select(v => new VenueCardDto(
                v.Id,
                v.Name,
                v.Address,
                v.TotalRows,
                v.SeatsPerRow,
                v.TotalRows * v.SeatsPerRow,
                v.Events.Count
            )).ToList();

            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var eventsByTitle = await _context.Events.ToListAsync();

            int CountContains(params string[] keywords) =>
                eventsByTitle.Count(e => keywords.Any(k =>
                    e.Title.Contains(k, StringComparison.OrdinalIgnoreCase)));

            var categories = new List<CategoryDto>
            {
                new("concert", "حفلات موسيقية", "𓏢", "أمسيات موسيقية ومهرجانات غنائية", CountContains("حفل", "موسيق", "غنائ", "concert")),
                new("conference", "مؤتمرات", "𓊪", "لقاءات مهنية وقمم متخصصة", CountContains("مؤتمر", "conference", "ندوة")),
                new("workshop", "ورش عمل", "𓂀", "جلسات عملية وتدريب مباشر", CountContains("ورشة", "ورش", "تدريب", "workshop")),
                new("exhibition", "معارض", "𓉐", "معارض فنية وثقافية", CountContains("معرض", "exhibition", "فن")),
                new("theater", "عروض مسرحية", "𓅓", "مسرحيات وعروض أدائية", CountContains("مسرح", "مسرحي", "theater")),
                new("sport", "بطولات رياضية", "𓃀", "منافسات وبطولات", CountContains("بطول", "رياض", "sport")),
                new("education", "محاضرات تعليمية", "𓋹", "محاضرات ومحتوى معرفي", CountContains("محاضر", "تعليم", "lecture")),
                new("festival", "مهرجانات", "𓆣", "احتفالات كبرى", CountContains("مهرجان", "festival", "احتفال"))
            };

            return Ok(categories);
        }

        [HttpGet("activity")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetActivity([FromQuery] int take = 8)
        {
            var recentBookings = await _context.Bookings
                .Include(b => b.Attendee)
                .Include(b => b.Seat).ThenInclude(s => s.Event)
                .Where(b => b.Status == BookingStatus.Confirmed)
                .OrderByDescending(b => b.BookedAt)
                .Take(take)
                .ToListAsync();

            var cities = new[] { "القاهرة", "الإسكندرية", "الأقصر", "أسوان", "الجيزة", "أسوان" };
            var hieroglyphs = new[] { "𓂀", "𓋹", "𓅓", "𓆣", "𓃀", "𓉐" };

            var result = recentBookings.Select((b, i) => new ActivityDto(
                b.Attendee?.Email?.Split('@')[0] ?? "ضيف",
                (b.Attendee?.Email ?? "?")[..1].ToUpper(),
                $"حجز مقعد في {b.Seat.Event.Title}",
                cities[i % cities.Length],
                $"{Math.Max(1, (int)(DateTime.UtcNow - b.BookedAt).TotalMinutes)} دقيقة",
                hieroglyphs[i % hieroglyphs.Length]
            )).ToList();

            return Ok(result);
        }

        [HttpGet("testimonials")]
        public async Task<ActionResult<IEnumerable<TestimonialDto>>> GetTestimonials([FromQuery] int take = 6)
        {
            var testimonials = await _context.Testimonials
                .Where(t => t.IsPublished)
                .OrderByDescending(t => t.CreatedAt)
                .Take(take)
                .Select(t => new TestimonialDto(
                    t.Id,
                    t.Name,
                    t.Role,
                    t.City,
                    t.Message,
                    t.Hieroglyph,
                    t.Rating
                ))
                .ToListAsync();

            return Ok(testimonials);
        }

        [HttpGet("pricing-rules")]
        public ActionResult<IEnumerable<PricingRuleDto>> GetPricingRules()
        {
            var rules = new List<PricingRuleDto>
            {
                new("early-bird", "عرض الحجز المبكر", "𓂀",
                    "احجز قبل الفعالية بأكثر من 30 يوم واحصل على خصم 20%",
                    "-20%"),
                new("weekend", "ضريبة نهاية الأسبوع", "𓅓",
                    "الفعاليات يومي الجمعة والسبت بزيادة 10%",
                    "+10%"),
                new("last-minute", "عرض اللحظة الأخيرة", "𓋹",
                    "احجز في آخر 3 أيام بزيادة 15% للإقبال الكبير",
                    "+15%")
            };

            return Ok(rules);
        }
    }
}