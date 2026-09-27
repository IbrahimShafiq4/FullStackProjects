import { Component } from '@angular/core';
import { ExperienceEntry } from '../../core/models/notebook.model';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [HandwrittenUnderline],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  readonly entries: ExperienceEntry[] = [
    {
      period: '٢٠٢٢ — دلوقتي',
      title: 'Senior Full-Stack Developer',
      place: 'نيل تك للأنظمة',
      lesson: 'القرار المعماري بيتقاس بالوقت اللي بيوفره، مش بعدد الأنماط اللي بيستخدمها.',
    },
    {
      period: '٢٠٢٠ — ٢٠٢٢',
      title: 'Full-Stack Developer',
      place: 'كود بلس',
      lesson: 'التسليم في الوقت مش تنازل عن الجودة، لكنه تدريب على ترتيب الأولويات.',
    },
    {
      period: '٢٠١٩ — ٢٠٢٠',
      title: 'Junior Backend Developer',
      place: 'إيجي سوفت',
      lesson: 'قراءة كود قديم بتعلّمك أكتر من كتابة كود جديد.',
    },
    {
      period: '٢٠١٥ — ٢٠١٩',
      title: 'بكالوريوس حاسبات ومعلومات',
      place: 'جامعة حلوان',
      lesson: 'الكلية بتدي الأساس. الباقي بيتعلم في الشغل.',
    },
  ];
}