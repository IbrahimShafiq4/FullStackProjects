import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  readonly sheetId = 'A-01';
  readonly sheetTitle = 'الغلاف';
  readonly office = 'مكتب الرسم الهندسي';
  readonly year = '٢٠٢٦';
  readonly developerName = 'ابراهيم شفيق';
  readonly role = 'مطوّر Full-Stack';
  readonly scale = '١:١';
  readonly revision = '٣';
  readonly date = '٢٠٢٦/٠٩';

  readonly materials = [
    { name: 'ASP.NET Core 10', note: 'أساسي' },
    { name: 'Angular 22', note: 'أساسي' },
    { name: 'SignalR', note: 'اتصال لحظي' },
    { name: 'SQL Server', note: 'تخزين' },
    { name: 'Entity Framework Core', note: 'ORM' },
  ];

  readonly notes = [
    'خبرة ٥ سنين في بناء أنظمة ويب كاملة من الـ DB لحد الـ UI.',
    'بشتغل بـ Clean Architecture و CQRS في المشاريع الكبيرة.',
  ];
}
