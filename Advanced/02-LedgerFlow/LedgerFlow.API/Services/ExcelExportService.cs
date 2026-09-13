using ClosedXML.Excel;
using LedgerFlow.API.Features.Queries;

namespace LedgerFlow.API.Services
{
    public interface IExcelExportService
    {
        byte[] ExportMonthlyReport(List<MonthlySummary> summaries);
    }

    public class ExcelExportService : IExcelExportService
    {
        public byte[] ExportMonthlyReport(List<MonthlySummary> summaries)
        {
            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("التقرير الشهري");

            sheet.RightToLeft = true;

            sheet.Cell(1, 1).Value = "الشهر";
            sheet.Cell(1, 2).Value = "الإيرادات";
            sheet.Cell(1, 3).Value = "المصروفات";
            sheet.Cell(1, 4).Value = "الصافي";

            var headerRange = sheet.Range(1, 1, 1, 4);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            int row = 2;
            foreach (var summary in summaries)
            {
                sheet.Cell(row, 1).Value = summary.Month;
                sheet.Cell(row, 2).Value = summary.TotalRevenue;
                sheet.Cell(row, 3).Value = summary.TotalExpenses;
                sheet.Cell(row, 4).Value = summary.NetBalance;
                row++;
            }

            sheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}