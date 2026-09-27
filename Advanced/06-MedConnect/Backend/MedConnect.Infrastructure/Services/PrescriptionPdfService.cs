using MedConnect.Application.Features;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MedConnect.Infrastructure.Services;

public interface IPrescriptionPdfService
{
    Task<string> GenerateAsync(
        string patientName,
        string doctorName,
        string specialty,
        List<PrescriptionMedicationDto> medications,
        string notes,
        IWebHostEnvironment env);
}

public class PrescriptionPdfService : IPrescriptionPdfService
{
    private static readonly string Teal = "#0d7373";
    private static readonly string TealDeep = "#085454";
    private static readonly string Ink = "#0c0c0c";
    private static readonly string Ash = "#6a6a6a";
    private static readonly string Line = "#e2ddd1";
    private static readonly string Paper = "#faf8f2";
    private static readonly string ZebraBg = "#f7f5ee";

    public PrescriptionPdfService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<string> GenerateAsync(
        string patientName,
        string doctorName,
        string specialty,
        List<PrescriptionMedicationDto> medications,
        string notes,
        IWebHostEnvironment env)
    {
        var fileName = $"{Guid.NewGuid()}.pdf";
        var folder = Path.Combine(env.WebRootPath, "uploads", "prescriptions");

        Directory.CreateDirectory(folder);

        var fullPath = Path.Combine(folder, fileName);
        var issuedAt = DateTime.Now;

        Document.Create(document =>
        {
            document.Page(page =>
            {
                page.Size(PageSizes.A5);
                page.Margin(0);
                page.ContentFromRightToLeft();

                page.DefaultTextStyle(style => style
                    .FontFamily("Lato", "Noto Sans Arabic")
                    .FontSize(10)
                    .FontColor(Ink));

                page.Content()
                    .Background(Paper)
                    .Padding(28)
                    .Column(column =>
                    {
                        column.Spacing(0);

                        column.Item()
                            .Background(Teal)
                            .Padding(18)
                            .Row(row =>
                            {
                                row.RelativeItem()
                                    .Column(content =>
                                    {
                                        content.Item()
                                            .Text(doctorName)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(16)
                                            .Bold()
                                            .FontColor(Colors.White);

                                        content.Item()
                                            .PaddingTop(2)
                                            .Text(specialty)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(10)
                                            .FontColor("#c9e8e8");

                                        content.Item()
                                            .PaddingTop(6)
                                            .Text("MedConnect · عيادة طبية متكاملة")
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(8.5f)
                                            .FontColor("#a8dada");
                                    });

                                row.ConstantItem(100)
                                    .AlignLeft()
                                    .Column(content =>
                                    {
                                        content.Item()
                                            .AlignLeft()
                                            .Text("روشتة طبية")
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(14)
                                            .Bold()
                                            .FontColor(Colors.White);

                                        content.Item()
                                            .AlignLeft()
                                            .PaddingTop(4)
                                            .Text(issuedAt.ToString("dd/MM/yyyy"))
                                            .FontSize(10)
                                            .FontColor("#c9e8e8");

                                        content.Item()
                                            .AlignLeft()
                                            .PaddingTop(2)
                                            .Text(issuedAt.ToString("HH:mm"))
                                            .FontSize(9)
                                            .FontColor("#a8dada");
                                    });
                            });

                        column.Item()
                            .Background(Colors.White)
                            .Border(1)
                            .BorderColor(Line)
                            .Padding(14)
                            .Row(row =>
                            {
                                row.RelativeItem()
                                    .Column(content =>
                                    {
                                        content.Item()
                                            .Text("اسم المريض")
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(8)
                                            .FontColor(Ash);

                                        content.Item()
                                            .PaddingTop(3)
                                            .Text(patientName)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(13)
                                            .Bold()
                                            .FontColor(Ink);
                                    });

                                row.ConstantItem(1).Background(Line);

                                row.ConstantItem(120)
                                    .PaddingLeft(14)
                                    .Column(content =>
                                    {
                                        content.Item()
                                            .Text("التاريخ")
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(8)
                                            .FontColor(Ash);

                                        content.Item()
                                            .PaddingTop(3)
                                            .Text(issuedAt.ToString(
                                                "dd MMMM yyyy",
                                                new System.Globalization.CultureInfo("ar-EG")))
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(11)
                                            .Bold()
                                            .FontColor(Ink);
                                    });
                            });

                        column.Item()
                            .PaddingTop(14)
                            .PaddingBottom(6)
                            .Row(row =>
                            {
                                row.ConstantItem(30)
                                    .Text("R/")
                                    .FontSize(22)
                                    .Bold()
                                    .FontColor(Teal);

                                row.RelativeItem()
                                    .AlignBottom()
                                    .PaddingBottom(4)
                                    .Text("الأدوية الموصوفة")
                                    .FontFamily("Lato", "Noto Sans Arabic")
                                    .FontSize(10)
                                    .FontColor(Ash);
                            });

                        column.Item()
                            .Border(1)
                            .BorderColor(Line)
                            .Background(Colors.White)
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(28);
                                    columns.RelativeColumn(2.4f);
                                    columns.RelativeColumn(1.2f);
                                    columns.RelativeColumn(1.4f);
                                    columns.RelativeColumn(1.2f);
                                });

                                table.Header(header =>
                                {
                                    header.Cell()
                                        .Background(TealDeep)
                                        .Padding(8)
                                        .Text("#")
                                        .FontSize(9)
                                        .Bold()
                                        .FontColor(Colors.White);

                                    header.Cell()
                                        .Background(TealDeep)
                                        .Padding(8)
                                        .Text("الدواء")
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontSize(9)
                                        .Bold()
                                        .FontColor(Colors.White);

                                    header.Cell()
                                        .Background(TealDeep)
                                        .Padding(8)
                                        .Text("الجرعة")
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontSize(9)
                                        .Bold()
                                        .FontColor(Colors.White);

                                    header.Cell()
                                        .Background(TealDeep)
                                        .Padding(8)
                                        .Text("التكرار")
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontSize(9)
                                        .Bold()
                                        .FontColor(Colors.White);

                                    header.Cell()
                                        .Background(TealDeep)
                                        .Padding(8)
                                        .Text("المدة")
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontSize(9)
                                        .Bold()
                                        .FontColor(Colors.White);
                                });

                                if (medications == null || medications.Count == 0)
                                {
                                    table.Cell()
                                        .ColumnSpan(5)
                                        .Padding(16)
                                        .AlignCenter()
                                        .Text("لم يتم إضافة أدوية")
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontColor(Ash)
                                        .FontSize(10);
                                }
                                else
                                {
                                    for (var i = 0; i < medications.Count; i++)
                                    {
                                        var medication = medications[i];
                                        var backgroundColor = i % 2 == 0
                                            ? Colors.White
                                            : Color.FromHex(ZebraBg);

                                        table.Cell()
                                            .Background(backgroundColor)
                                            .Padding(8)
                                            .Text((i + 1).ToString())
                                            .FontSize(10)
                                            .FontColor(Ash);

                                        table.Cell()
                                            .Background(backgroundColor)
                                            .Padding(8)
                                            .Column(content =>
                                            {
                                                content.Item()
                                                    .Text(medication.Name ?? string.Empty)
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(10.5f)
                                                    .Bold();

                                                if (!string.IsNullOrWhiteSpace(medication.Notes))
                                                {
                                                    content.Item()
                                                        .PaddingTop(2)
                                                        .Text(medication.Notes)
                                                        .FontFamily("Lato", "Noto Sans Arabic")
                                                        .FontSize(8.5f)
                                                        .FontColor(Ash)
                                                        .Italic();
                                                }
                                            });

                                        table.Cell()
                                            .Background(backgroundColor)
                                            .Padding(8)
                                            .Text(medication.Dose ?? string.Empty)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(10);

                                        table.Cell()
                                            .Background(backgroundColor)
                                            .Padding(8)
                                            .Text(medication.Frequency ?? string.Empty)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(10);

                                        table.Cell()
                                            .Background(backgroundColor)
                                            .Padding(8)
                                            .Text(medication.Duration ?? string.Empty)
                                            .FontFamily("Lato", "Noto Sans Arabic")
                                            .FontSize(10);
                                    }
                                }
                            });

                        if (!string.IsNullOrWhiteSpace(notes))
                        {
                            column.Item()
                                .PaddingTop(16)
                                .Column(content =>
                                {
                                    content.Item()
                                        .PaddingBottom(6)
                                        .Row(row =>
                                        {
                                            row.ConstantItem(24)
                                                .Text("•")
                                                .FontSize(14)
                                                .Bold()
                                                .FontColor(Teal);

                                            row.RelativeItem()
                                                .AlignBottom()
                                                .Text("ملاحظات إضافية")
                                                .FontFamily("Lato", "Noto Sans Arabic")
                                                .FontSize(10)
                                                .FontColor(Ash);
                                        });

                                    content.Item()
                                        .Background(Colors.White)
                                        .Border(1)
                                        .BorderColor(Line)
                                        .BorderLeft(3)
                                        .BorderColor(Teal)
                                        .Padding(12)
                                        .Text(notes)
                                        .FontFamily("Lato", "Noto Sans Arabic")
                                        .FontSize(10.5f)
                                        .LineHeight(1.6f);
                                });
                        }

                        column.Item()
                            .PaddingTop(24)
                            .Extend();

                        column.Item()
                            .PaddingTop(20)
                            .Column(content =>
                            {
                                content.Item()
                                    .LineHorizontal(1)
                                    .LineColor(Line);

                                content.Item()
                                    .PaddingTop(14)
                                    .Row(row =>
                                    {
                                        row.RelativeItem()
                                            .Column(signature =>
                                            {
                                                signature.Item()
                                                    .Text("توقيع الطبيب")
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(8)
                                                    .FontColor(Ash);

                                                signature.Item()
                                                    .PaddingTop(6)
                                                    .Text(doctorName)
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(15)
                                                    .Italic()
                                                    .FontColor(TealDeep);

                                                signature.Item()
                                                    .PaddingTop(2)
                                                    .Text($"اعتماد إلكتروني · {issuedAt:HH:mm}")
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(8)
                                                    .FontColor(Ash);
                                            });

                                        row.ConstantItem(140)
                                            .AlignLeft()
                                            .Column(details =>
                                            {
                                                details.Item()
                                                    .Text("التاريخ")
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(8)
                                                    .FontColor(Ash);

                                                details.Item()
                                                    .PaddingTop(6)
                                                    .Text(issuedAt.ToString("dd/MM/yyyy"))
                                                    .FontSize(11)
                                                    .Bold();

                                                details.Item()
                                                    .PaddingTop(2)
                                                    .Text("رقم الروشتة")
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(8)
                                                    .FontColor(Ash);

                                                details.Item()
                                                    .PaddingTop(2)
                                                    .Text(fileName.Replace(".pdf", string.Empty)[..8].ToUpper())
                                                    .FontFamily("Lato", "Noto Sans Arabic")
                                                    .FontSize(9)
                                                    .FontColor(Ash);
                                            });
                                    });
                            });

                        column.Item()
                            .PaddingTop(18)
                            .Background(TealDeep)
                            .Padding(10)
                            .Row(row =>
                            {
                                row.RelativeItem()
                                    .Text("MedConnect · نظام طبي رقمي")
                                    .FontFamily("Lato", "Noto Sans Arabic")
                                    .FontSize(8)
                                    .FontColor("#a8dada");

                                row.RelativeItem()
                                    .AlignLeft()
                                    .Text("هذه الروشتة صادرة إلكترونياً وموثقة في السجل الطبي")
                                    .FontFamily("Lato", "Noto Sans Arabic")
                                    .FontSize(8)
                                    .FontColor("#a8dada");
                            });
                    });
            });
        }).GeneratePdf(fullPath);

        await Task.CompletedTask;

        return $"/uploads/prescriptions/{fileName}";
    }
}