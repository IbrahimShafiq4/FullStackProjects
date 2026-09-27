import { Component } from '@angular/core';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HandwrittenUnderline],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly paragraphs: string[] = [
    'اسمي رؤى ياسر. بشتغل مطوّرة ويب بقالي خمس سنين، بدأت من الواجهات وبعدها دخلت على الـ backend لما حسّيت إني محتاجة أفهم الصورة كلها.',
    'بحب المشاريع اللي فيها منطق حقيقي، مش اللي بتتعمل للعرض. لو المشكلة واضحة من الأول، غالبًا الحل بيبقى عادي. لكن لما يكون فيه قيود وتفاصيل كتير، هنا بيبقى فيه حاجة تستاهل.',
    'بشتغل غالبًا بـ ASP.NET Core و Angular. بحب الكود يبقى مقروء أكتر من إنه يبقى شاطر. وبفضّل الحل البسيط حتى لو مش مبهر، لأن اللي بيفضل هو اللي بيوصل.'
  ];

  readonly marginNotes: string[] = [
    'اتعلمت أكتر من المشاريع اللي فشلت',
    'البساطة صعبة',
    'الوقت بيعلّم'
  ];

  readonly facts: { label: string; value: string }[] = [
    { label: 'المدينة', value: 'القاهرة' },
    { label: 'الخبرة', value: '٥ سنين' },
    { label: 'المجال', value: 'Full-Stack' },
    { label: 'اللغات', value: 'عربي · إنجليزي' },
  ];
}