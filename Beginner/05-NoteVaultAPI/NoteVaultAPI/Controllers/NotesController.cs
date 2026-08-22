using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoteVaultAPI.Data;
using NoteVaultAPI.DTOs.NoteDto;
using NoteVaultAPI.Models;
using System.Security.Claims;

namespace NoteVaultAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext   _context;
        private readonly IMapper        _mapper;

        public NotesController(AppDbContext context, IMapper mapper)
        { _context = context; _mapper = mapper; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoteDto>>> GetMyNotes()
        {
            var userId = GetCurrentUserId();

            var notes = await _context.Notes
                                      .Where(n => n.AppUserId == userId)
                                      .OrderByDescending(n => n.CreatedAt)
                                      .ToListAsync();

            return Ok(_mapper.Map<List<NoteDto>>(notes));
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> CreateNote(CreateNoteDto dto)
        {
            var note = new Note
            {
                Title = dto.Title,
                Content = dto.Content,
                AppUserId = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notes.AddAsync(note);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<NoteDto>(note));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note is null) { return NotFound(); }

            if (note.AppUserId != GetCurrentUserId()) { return Forbid(); }

            var noteName = note.Title;

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Note with the name: {noteName} Has Been Deleted Successfully" });
        }
    }
}
