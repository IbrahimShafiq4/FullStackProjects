import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OWNER } from '../../core/models/notebook.model';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

interface Feature {
  no: string;
  title: string;
  body: string;
}

interface Step {
  no: string;
  title: string;
  body: string;
}

interface Metric {
  value: string;
  label: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, HandwrittenUnderline],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  readonly owner = OWNER;

  readonly features: Feature[] = [
    { no: '٠١', title: 'محادثة لحظية', body: 'العميل والوكيل بيتكلموا في نفس اللحظة. مفيش تحديث، مفيش انتظار، مفيش "ابعتلي إيميل".' },
    { no: '٠٢', title: 'SLA أوتوماتيك', body: 'كل تذكرة بتاخد موعد تسليم حسب أولويتها. العدّاد بيتحرك، والوكيل شايف فاضل قد إيه.' },
    { no: '٠٣', title: 'مرفقات كاملة', body: 'صور، فيديو، وصوت. كل نوع بقواعده وأحجامه. محدش محتاج يشرح المشكلة بالكلام بس.' },
    { no: '٠٤', title: 'صلاحيات حسب الدور', body: 'العميل بيشوف تذاكره بس. الوكيل بيشوف الكل. والمدير بيشوف الأرقام.' },
    { no: '٠٥', title: 'ملاحظات داخلية', body: 'الوكلاء بيكتبوا ملاحظات على التذكرة، من غير ما العميل يشوفها. التوثيق في مكانه.' },
    { no: '٠٦', title: 'تقارير وقياس', body: 'متوسط زمن الرد، نسبة الالتزام بالـ SLA، وتوزيع التذاكر حسب الفئة والأولوية.' },
  ];

  readonly steps: Step[] = [
    { no: 'الخطوة ١', title: 'افتح حساب', body: 'اختار إنك عميل أو وكيل دعم. التسجيل بياخد أقل من دقيقة.' },
    { no: 'الخطوة ٢', title: 'افتح تذكرة', body: 'اكتب الموضوع، حدد الأولوية والفئة، وارفع أي مرفق يوضّح المشكلة.' },
    { no: 'الخطوة ٣', title: 'تابع الحل', body: 'الوكيل بيستلم التذكرة فورًا. بتوصلك الرسائل لحظيًا، والعدّاد شغّال.' },
  ];

  readonly metrics: Metric[] = [
    { value: '١٨ دقيقة', label: 'متوسط زمن الرد' },
    { value: '٩١٪', label: 'رضا العملاء' },
    { value: '٤٥', label: 'وكيل نشط' },
    { value: '٨ آلاف', label: 'عميل مسجّل' },
  ];

  readonly sample = {
    subject: 'الفاتورة مش بتظهر',
    customer: 'رؤى ياسر',
    agent: 'أحمد شفيق',
    sla: 'فاضل ٠٦:٤٢',
    priority: 'عالية',
  };
}