import { Component } from '@angular/core';
import { Project } from '../../core/models/notebook.model';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';
import { CheckMark } from '../../shared/check-mark/check-mark';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [HandwrittenUnderline, CheckMark],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  readonly projects: Project[] = [
    {
      no: 'واجب ١',
      title: 'SignalDesk — نظام تذاكر دعم فني',
      brief: 'شركة كانت شغالة بالإيميل والواتساب. التذاكر بتضيع، ومحدش عارف مين مسؤول عن إيه.',
      answer: 'بنيت نظام بيوصل العميل بالوكيل في نفس اللحظة، وحساب SLA أوتوماتيك، وملاحظات داخلية للوكلاء.',
      stack: ['ASP.NET Core 8', 'Angular 19', 'SignalR', 'SQL Server'],
      score: '١٠ / ١٠',
      teacherNote: 'شغل نظيف، والتنظيم واضح من أول ملف لآخر واحد.',
    },
    {
      no: 'واجب ٢',
      title: 'مشوار — حجز رحلات بين المدن',
      brief: 'الحجز كان بالكاش والتليفون. الإلغاءات كتير، والشركات بتخسر كراسي فاضية.',
      answer: 'CQRS مع MediatR، كاش Redis للبحث، دفع Stripe، و Hangfire لتحرير الكراسي المحجوزة.',
      stack: ['ASP.NET Core', 'Angular', 'Redis', 'Stripe'],
      score: '٩.٥ / ١٠',
      teacherNote: 'الـ caching محسوب صح. بس خدت وقت في الـ retry logic.',
    },
    {
      no: 'واجب ٣',
      title: 'دفتر المصنع — تتبع إنتاج',
      brief: 'كل حاجة على ورق. لما جهة رقابية بتيجي، الملفات بتتقلب أيام.',
      answer: 'نظام تتبع هرمي بالباركود، من استلام الخامة لحد الشحن. وتقارير Excel أوتوماتيك.',
      stack: ['ASP.NET Core', 'Angular', 'ClosedXML', 'Barcode'],
      score: '١٠ / ١٠',
      teacherNote: 'بساطة التصميم هي أقوى حاجة فيه.',
    },
  ];
}