using LedgerFlow.API.Data;
using LedgerFlow.API.Features.Queries;
using LedgerFlow.API.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LedgerFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController: ControllerBase
    {
        private readonly IMediator              _mediator;
        private readonly IExcelExportService    _excelService;

        public ReportsController(
            IMediator           mediator,
            IExcelExportService excelService
        )
        {
            _mediator = mediator;
            _excelService = excelService;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("monthly/{year}")]
        public async Task<IActionResult> GetMonthlyReport(int year)
        {
            var result = await _mediator.Send(new GetMonthlyReportQuery(GetCurrentUserId(), year));
            return Ok(result);
        }

        [HttpGet("monthly/{year}/export")]
        public async Task<IActionResult> ExportMonthlyReport(int year)
        {
            var summaries = await _mediator.Send(new GetMonthlyReportQuery(GetCurrentUserId(), year));
            var fileBytes = _excelService.ExportMonthlyReport(summaries);

            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"report-{year}.xlsx");
        }
    }
}