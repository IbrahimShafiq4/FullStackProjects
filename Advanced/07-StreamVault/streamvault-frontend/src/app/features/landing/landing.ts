import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

interface ISchoolFloor {
  number: number;
  name: string;
  icon: string;
  color: string;
}

interface IClassroomPreview {
  number: number;
  title: string;
  teacher: string;
  status: 'live' | 'study' | 'exam' | 'empty';
  students: number;
}

interface IFeatureItem {
  title: string;
  description: string;
  icon: string;
}

interface IFeatureStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly currentYear: number = new Date().getFullYear();

  public sampleAnswer: WritableSignal<string> = signal<string>('');
  public sampleResult: WritableSignal<'idle' | 'correct' | 'wrong'> = signal<'idle' | 'correct' | 'wrong'>('idle');

  public bellRinging: WritableSignal<boolean> = signal<boolean>(false);
  public currentHour: WritableSignal<number> = signal<number>(new Date().getHours());

  public schoolFloors: ISchoolFloor[] = [
    { number: 1, name: 'الأساسيات', icon: '📚', color: '#4a5c4e' },
    { number: 2, name: 'التعميق', icon: '🔬', color: '#5f3d1c' },
    { number: 3, name: 'التخصص', icon: '🎓', color: '#1e2836' }
  ];

  public classroomPreviews: IClassroomPreview[] = [
    { number: 1, title: 'الرياضيات', teacher: 'أ. محمود', status: 'live', students: 24 },
    { number: 2, title: 'البرمجة', teacher: 'م. سارة', status: 'study', students: 18 },
    { number: 3, title: 'الفيزياء', teacher: 'د. أحمد', status: 'exam', students: 12 },
    { number: 4, title: 'الكيمياء', teacher: 'أ. ليلى', status: 'study', students: 15 },
    { number: 5, title: 'الإنجليزية', teacher: 'م. هدى', status: 'live', students: 22 },
    { number: 6, title: 'التاريخ', teacher: 'أ. علي', status: 'empty', students: 0 }
  ];

  public features: IFeatureItem[] = [
    {
      title: 'سبورة تفاعلية',
      description: 'سطح حقيقي للشرح، الرسم، وعرض الأسئلة — في الفصل اللايف على طول.',
      icon: 'board'
    },
    {
      title: 'مذكرات وملفات',
      description: 'ارفع PDF, DOCX, PPTX وسيب الطالب يحمّلها، أو حط سعر ليها لو مميزة.',
      icon: 'book'
    },
    {
      title: 'تتبع تلقائي',
      description: 'سجل الطالب بيبان تلقائيًا — إيه اللي خلصه، وفين وقف بالظبط.',
      icon: 'clock'
    },
    {
      title: 'دفع آمن',
      description: 'اشتراك شهري أو شراء كورس أو مذكرة — كل عملية دفع موثّقة ومسجّلة.',
      icon: 'shield'
    }
  ];

  public stats: IFeatureStat[] = [
    { value: '+١٠٠', label: 'طالب نشط' },
    { value: '+٢٥', label: 'مدرس خبير' },
    { value: '+١٥٠', label: 'درس فيديو' },
    { value: '٤.٨', label: 'متوسط التقييم' }
  ];

  public submitSample(): void {
    const answer: string = this.sampleAnswer().trim();
    if (!answer) return;

    if (answer.toLowerCase() === '22') {
      this.sampleResult.set('correct');
    } else {
      this.sampleResult.set('wrong');
    }
  }

  public resetSample(): void {
    this.sampleAnswer.set('');
    this.sampleResult.set('idle');
  }

  public ringBell(): void {
    if (this.bellRinging()) return;
    this.bellRinging.set(true);
    setTimeout(() => this.bellRinging.set(false), 1500);
  }
}