import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeaturedDoctorsService } from '../../core/services/featured-doctors.service';

interface IDepartment {
  code: string;
  floor: string;
  ar: string;
  en: string;
  color: string;
  body: string;
}

interface IStep {
  n: string;
  ar: string;
  en: string;
  body: string;
}

interface ITechRow {
  layer: string;
  stack: string;
  status: string;
  statusColor: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  readonly _auth = inject(AuthService);
  readonly _featured = inject(FeaturedDoctorsService);


  readonly departments: IDepartment[] = [
    { code: 'DR', floor: 'F-01', ar: 'الأطباء', en: 'DOCTORS', color: 'green', body: 'شبكة أطباء متخصصين. بحث دقيق، تصفية حسب التخصص، واختيار سريع للطبيب المناسب.' },
    { code: 'AP', floor: 'F-02', ar: 'المواعيد', en: 'APPOINTMENTS', color: 'orange', body: 'تحقق تلقائي من التوفر، منع التعارض، ونظام حجز فوري بلا انتظار.' },
    { code: 'VC', floor: 'F-03', ar: 'المكالمات', en: 'VIDEO CALLS', color: 'blue', body: 'اتصال مرئي مباشر بين الطبيب والمريض عبر SignalR و WebRTC، دون وسيط.' },
    { code: 'RX', floor: 'F-04', ar: 'الروشتات', en: 'PRESCRIPTIONS', color: 'red', body: 'إصدار روشتات PDF موثقة تلقائياً بعد كل استشارة، جاهزة للطباعة أو الحفظ.' },
  ];

  readonly steps: IStep[] = [
    { n: '01', ar: 'التسجيل', en: 'REGISTER', body: 'أنشئ حسابك كمريض أو طبيب في خطوات.' },
    { n: '02', ar: 'البحث', en: 'SEARCH', body: 'صفّ الأطباء حسب التخصص.' },
    { n: '03', ar: 'الحجز', en: 'BOOK', body: 'اختر الوقت المتاح وأكّد الحجز.' },
    { n: '04', ar: 'المكالمة', en: 'CONSULT', body: 'مكالمة فيديو عند حلول الموعد.' },
    { n: '05', ar: 'الروشتة', en: 'RECEIVE', body: 'روشتة PDF موثقة في حسابك.' },
  ];

  readonly tech: ITechRow[] = [
    { layer: 'FRONTEND', stack: 'Angular · TypeScript', status: 'STABLE', statusColor: 'green' },
    { layer: 'BACKEND', stack: 'ASP.NET Core · C#', status: 'STABLE', statusColor: 'green' },
    { layer: 'DATABASE', stack: 'SQL Server · EF Core', status: 'STABLE', statusColor: 'green' },
    { layer: 'REALTIME', stack: 'SignalR · WebRTC', status: 'LIVE', statusColor: 'orange' },
    { layer: 'SECURITY', stack: 'JWT · Identity', status: 'SECURE', statusColor: 'blue' },
  ];

  readonly stats = [
    { code: 'DEPT', value: '04', label: 'الأقسام' },
    { code: 'FLOW', value: '05', label: 'الخطوات' },
    { code: 'HOURS', value: '24/7', label: 'التشغيل' },
    { code: 'UPTIME', value: '99.9%', label: 'الاستمرارية' },
  ];

  ngOnInit(): void {
    this._featured.load(6);
  }
}