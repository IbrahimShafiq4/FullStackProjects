import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggle],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  public auth = inject(AuthService);

  readonly heroStations = [
    { code: 'CND', label: 'مرشّح' },
    { code: 'MAT', label: 'مطابقة' },
    { code: 'DST', label: 'وجهة' },
    { code: 'APP', label: 'تقديم' },
    { code: 'INT', label: 'مقابلة' },
    { code: 'HIR', label: 'تعيين' },
  ];

  readonly capabilities = [
    {
      code: 'L1',
      title: 'اكتشاف الوجهات',
      body: 'ابحث بالدور أو المهارة أو الموقع. الوجهات مرتبة حسب قربها من ملفك المهني.',
    },
    {
      code: 'L2',
      title: 'تحسين المسار',
      body: 'محرك المطابقة يوضّح لماذا هذه الوجهة قريبة منك — مهارة بمهارة.',
    },
    {
      code: 'L3',
      title: 'تتبّع الرحلة',
      body: 'كل طلب له خط واضح: مُرسَل، قيد المراجعة، قائمة مختصرة، مقابلة، عرض.',
    },
    {
      code: 'L4',
      title: 'إشعارات فورية',
      body: 'تنبيهات عند كل تغيّر في الرحلة — دون الحاجة إلى تحديث الصفحة.',
    },
  ];

  readonly employerPoints = [
    { code: 'E1', title: 'افتح وجهة جديدة', body: 'انشر وظيفة بخطوات قصيرة وواضحة.' },
    { code: 'E2', title: 'استقبل الرحلات', body: 'شاهد الطلبات مرتبة حسب درجة المطابقة.' },
    { code: 'E3', title: 'اختر الوصول', body: 'قائمة مختصرة، رفض، أو ترقية — بضغطة واحدة.' },
  ];
}