import { Component, inject, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MummySarcophagus } from '../mummy-sarcophagus/mummy-sarcophagus';
import { TempleScene } from '../temple-scene/temple-scene';
import { TemplePillar } from '../temple-pillar/temple-pillar';
import { QuoteGlyph } from '../../shared/components/quote-glyph/quote-glyph';

interface IProject {
  code: string;
  name: string;
  tagline: string;
  purpose: string;
  audience: string;
  features: string[];
  status: string;
  glyph: string;
}

interface IPassage {
  ordinal: string;
  title: string;
  hint: string;
  href: string;
}

interface IDeity {
  name: string;
  role: string;
  glyph: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MummySarcophagus, TempleScene, TemplePillar, QuoteGlyph],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  public _AuthService: AuthService = inject(AuthService);

  public passages: WritableSignal<IPassage[]> = signal([
    { ordinal: 'I', title: 'المدخل', hint: 'المشاريع', href: '#projects' },
    { ordinal: 'II', title: 'قاعة الأعمدة', hint: 'كيف تعمل', href: '#story' },
    { ordinal: 'III', title: 'المسلّة', hint: 'الأدوات', href: '#tools' },
    { ordinal: 'IV', title: 'المعبد', hint: 'المعرض', href: '#temple' },
    { ordinal: 'V', title: 'الآلهة', hint: 'الرموز', href: '#deities' },
    { ordinal: 'VI', title: 'المقبرة', hint: 'الحرّاس', href: '#mummies' },
    { ordinal: 'VII', title: 'البوابة', hint: 'تواصل', href: '#contact' },
  ]);

  public projects: WritableSignal<IProject[]> = signal([
    {
      code: 'VLT-001',
      name: 'نظام عروض الأسعار',
      tagline: 'من المسودة إلى الفاتورة — رحلة عرض واحد',
      purpose: 'أداة بتخلي المستقل يبني عرض سعر احترافي في دقايق، من غير فوضى Excel ولا رسومات يدوية.',
      audience: 'مستقلون، وكالات صغيرة، وأي حد بيعرض خدمة على عميل.',
      features: [
        'بنود قابلة للزيادة والحذف مع حساب فوري',
        'حساب ضريبة تلقائي بأكثر من طريقة',
        'دورة حياة واضحة: مسودة → مُرسل → مقبول → فاتورة',
        'لوحة إيرادات بتجمع كل المُفوتر',
      ],
      status: 'قيد العمل',
      glyph: 'ankh',
    },
    {
      code: 'VLT-002',
      name: 'بوابة العميل',
      tagline: 'لينك واحد لكل عرض — القرار بيد العميل',
      purpose: 'كل عرض بيتحوّل للينك عام مؤقت، العميل يفتحه من أي مكان، يشوف التفاصيل ويقبل أو يرفض مباشرة.',
      audience: 'العملاء النهائيون لأي مستقل بيستخدم النظام.',
      features: [
        'لينك عام لكل عرض من غير تسجيل دخول',
        'العميل يكتب ملاحظته مع القرار',
        'متابعة لحظية لحالة العرض',
        'إشعار عند أول قراءة للعرض',
      ],
      status: 'قيد العمل',
      glyph: 'eye',
    },
    {
      code: 'VLT-003',
      name: 'محرّك الضرائب',
      tagline: 'قواعد ضريبية منفصلة عن منطق العمل',
      purpose: 'طبقة بتعزل حساب الضريبة عشان تتغير القواعد من غير ما نلمس بقية النظام.',
      audience: 'المستخدم النهائي بيشوف نتيجة دقيقة تلقائيًا.',
      features: [
        'ثلاث طرق حساب: بدون، نسبة ثابتة، متدرجة',
        'النتيجة موحّدة على كل السجلات',
        'القواعد قابلة للتوسعة بدون تعديل الواجهة',
      ],
      status: 'مُصمَّم',
      glyph: 'scarab',
    },
    {
      code: 'VLT-004',
      name: 'لوحة السجلات',
      tagline: 'كل عروضك في مكان واحد',
      purpose: 'واجهة بتجمع كل عروض المستخدم مع إجمالي الإيرادات المُفوترة وحالة كل عرض.',
      audience: 'المستخدم النهائي للنظام.',
      features: [
        'قائمة مباشرة بكل العروض',
        'هوية بصرية مميزة لكل عرض',
        'إجمالي الإيرادات في السطر الأول',
      ],
      status: 'قيد العمل',
      glyph: 'lotus',
    },
  ]);

  public tools: WritableSignal<string[]> = signal([
    'واجهة عربية بالكامل',
    'يعمل على الجوال والحاسوب',
    'وضع فاتح وداكن',
    'حساب لحظي للضرائب',
    'لينك عام للعميل',
    'متابعة حالة العرض',
    'أرشيف كامل للسجلات',
    'إيرادات مُجمّعة',
  ]);

  public deities: WritableSignal<IDeity[]> = signal([
    { name: 'رع', role: 'الشمس', glyph: '𓇳', description: 'رب الشمس والخلق، يبحر في سماء النهار ويجوب العالم السفلي ليلاً.' },
    { name: 'أوزوريس', role: 'البعث', glyph: '𓊹', description: 'رب العالم الآخر والبعث، حاكم الأموات ومصدر الحياة المتجددة.' },
    { name: 'إيزيس', role: 'السحر', glyph: '𓋹', description: 'ربة السحر والأمومة، حامية الحكماء وعون من يستنجد بها.' },
    { name: 'حورس', role: 'الملكية', glyph: '𓂀', description: 'الصقر الذي يحمي الفرعون، عينه ترى كل شيء ولا يخفى عنها شيء.' },
    { name: 'تحوت', role: 'الحكمة', glyph: '𓁹', description: 'رب الكتابة والعلم، كاتب الآلهة ومعلّم البشرية أسرار المعرفة.' },
    { name: 'أنوبيس', role: 'الحراسة', glyph: '𓆣', description: 'ابن آوى حارس المقابر، يزن القلوب ويهدي الأرواح إلى الطريق.' },
    { name: 'ماعت', role: 'العدل', glyph: '𓆼', description: 'ربة الحقيقة والعدل، ريشتها تزن القلوب في محكمة أوزوريس.' },
    { name: 'بس', role: 'الحماية', glyph: '𓃀', description: 'القزم الحامي للبيوت والأطفال، يطرد الأرواح الشريرة بالرقص.' },
  ]);

  public mummyNames: WritableSignal<string[]> = signal([
    'الفرعون رمسيس',
    'الكاهن الأعظم',
    'الملكة نيت',
    'الكاتب الملكي',
    'قائد الجيش',
    'حكيم طيبة',
  ]);
}