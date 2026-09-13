import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TestimonialService } from '../../core/services/testimonial.service';

interface IStat { label: string; value: string; hint: string; }
interface IFeature { num: string; title: string; desc: string; icon: string; }
interface IStep { num: string; title: string; desc: string; time: string; }
interface ITechRow { label: string; value: string; }
interface IFaq { q: string; a: string; }

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styles: `
    .lp { min-height: 100vh; background: var(--paper); color: var(--ink); position: relative; overflow-x: hidden; }
    .grid-bg {
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.045) 1px, transparent 1px);
      background-size: 40px 40px; pointer-events: none; z-index: 0;
    }
    .lp-nav { position: sticky; top: 0; z-index: 50; background: rgba(244,242,236,0.92); backdrop-filter: blur(12px); border-bottom: 2px solid var(--line); }
    .lp-nav-in { max-width: 1280px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .lp-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
    .lp-brand-mark { width: 34px; height: 34px; background: var(--ink); color: var(--paper); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px; }
    .lp-brand-name { font-family: 'Noto Kufi Arabic', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
    .lp-nav-links { display: flex; gap: 4px; }
    .lp-nav-link { padding: 7px 12px; color: var(--ink); text-decoration: none; font-size: 13.5px; font-weight: 500; border: 1px solid transparent; transition: all 0.15s ease; background: transparent; font-family: inherit; cursor: pointer; }
    .lp-nav-link:hover { border-color: var(--line); background: var(--paper-2); }
    .lp-nav-actions { display: flex; gap: 8px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border: 2px solid var(--line); font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; background: transparent; color: var(--ink); text-decoration: none; transition: all 0.15s ease; white-space: nowrap; }
    .btn-solid { background: var(--ink); color: var(--paper); }
    .btn-solid:hover { background: var(--blue); border-color: var(--blue); box-shadow: 4px 4px 0 var(--line); transform: translate(-2px, -2px); }
    .btn-ghost:hover { background: var(--paper-2); }
    .btn-lg { padding: 14px 24px; font-size: 15.5px; }
    .wrap { position: relative; max-width: 1280px; margin: 0 auto; padding: 0 20px; z-index: 1; }
    .hero { padding: 64px 0 40px; }
    .hero-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--line); font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; background: var(--paper); margin-bottom: 24px; }
    .hero-tag-dot { width: 6px; height: 6px; background: var(--green); animation: blink 1.5s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: end; }
    .hero-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(2.4rem, 5.5vw, 5rem); line-height: 1.05; font-weight: 800; letter-spacing: -2px; margin: 0 0 22px; }
    .hero-title-line { display: block; }
    .hero-title em { color: var(--blue); font-style: normal; }
    .hero-title-mark { display: inline-block; background: var(--amber); padding: 0 12px; transform: rotate(-1deg); border: 2px solid var(--line); }
    .hero-sub { font-size: 17px; line-height: 1.65; color: var(--muted); max-width: 560px; margin: 0 0 32px; }
    .hero-ctas { display: flex; gap: 10px; flex-wrap: wrap; }
    .hero-side { display: flex; flex-direction: column; gap: 14px; }
    .blueprint-card { border: 2px solid var(--line); background: var(--paper); padding: 20px; position: relative; }
    .blueprint-card::before { content: 'FIG. 001'; position: absolute; top: -10px; right: 16px; background: var(--paper); padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--muted); }
    .bp-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed rgba(13,13,13,0.15); font-family: 'JetBrains Mono', monospace; font-size: 13px; }
    .bp-row:last-child { border-bottom: none; }
    .bp-key { color: var(--muted); }
    .bp-val { font-weight: 600; }
    .bp-val-accent { color: var(--blue); font-weight: 700; }
    .marquee { border-top: 2px solid var(--line); border-bottom: 2px solid var(--line); background: var(--ink); color: var(--paper); padding: 16px 0; overflow: hidden; margin-top: 40px; }
    .marquee-track { display: flex; gap: 32px; white-space: nowrap; width: max-content; animation: slide 40s linear infinite; font-family: 'Noto Kufi Arabic', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .marquee-item { display: inline-flex; align-items: center; gap: 32px; }
    .marquee-dot { color: var(--amber); font-size: 13px; }
    @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .section { padding: 60px 0; position: relative; }
    .section-head { margin-bottom: 36px; display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: baseline; padding-bottom: 18px; border-bottom: 2px solid var(--line); }
    .section-num { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--blue); letter-spacing: 2px; font-weight: 700; }
    .section-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(1.7rem, 3.2vw, 2.6rem); font-weight: 800; letter-spacing: -1.2px; line-height: 1.1; margin: 0; }
    .section-title em { color: var(--blue); font-style: normal; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); border: 2px solid var(--line); }
    .stat { padding: 22px 18px; border-left: 2px solid var(--line); background: var(--paper); transition: background 0.15s ease; }
    .stat:first-child { border-left: none; }
    .stat:hover { background: var(--paper-2); }
    .stat-num { font-family: 'JetBrains Mono', monospace; font-size: clamp(1.9rem, 3.6vw, 3rem); font-weight: 700; letter-spacing: -2px; line-height: 1; color: var(--ink); display: block; margin-bottom: 10px; }
    .stat-num-accent { color: var(--blue); }
    .stat-label { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 15.5px; font-weight: 700; display: block; margin-bottom: 4px; }
    .stat-hint { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); letter-spacing: 0.5px; }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); border: 2px solid var(--line); }
    .feature { padding: 28px 22px; border-left: 2px solid var(--line); border-bottom: 2px solid var(--line); transition: all 0.2s ease; background: var(--paper); }
    .feature:nth-child(3n) { border-left: none; }
    .feature:nth-last-child(-n+3) { border-bottom: none; }
    .feature:hover { background: var(--ink); color: var(--paper); }
    .feature:hover .feature-num { color: var(--amber); }
    .feature:hover .feature-desc { color: #999; }
    .feature:hover .feature-icon { border-color: var(--paper); }
    .feature-num { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: var(--blue); letter-spacing: 2px; display: block; margin-bottom: 16px; }
    .feature-icon { width: 44px; height: 44px; border: 2px solid var(--line); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; transition: all 0.2s ease; }
    .feature-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; margin: 0 0 10px; }
    .feature-desc { font-size: 14.5px; line-height: 1.65; color: var(--muted); margin: 0; transition: color 0.2s ease; }
    .how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .how-step { border: 2px solid var(--line); padding: 24px; background: var(--paper); }
    .how-num { font-family: 'JetBrains Mono', monospace; font-size: 52px; font-weight: 800; line-height: 0.85; color: var(--amber); letter-spacing: -3px; display: block; margin-bottom: 14px; }
    .how-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 21px; font-weight: 700; letter-spacing: -0.5px; margin: 0 0 10px; }
    .how-desc { font-size: 14.5px; line-height: 1.65; color: var(--muted); margin: 0 0 14px; }
    .how-time { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 2px; color: var(--blue); padding-top: 12px; border-top: 1px dashed var(--line); display: block; }
    .tech-panel { display: grid; grid-template-columns: 1fr 1.2fr; border: 2px solid var(--line); background: var(--paper); }
    .tech-left { background: var(--ink); color: var(--paper); padding: 36px 28px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
    .tech-left::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(244,242,236,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,236,0.05) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; }
    .tech-left-in { position: relative; z-index: 1; }
    .tech-kicker { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 3px; color: var(--amber); text-transform: uppercase; margin-bottom: 14px; display: block; }
    .tech-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -1px; line-height: 1.2; margin: 0 0 12px; }
    .tech-desc { font-size: 14.5px; line-height: 1.65; color: #999; margin: 0; }
    .tech-right { padding: 28px; display: flex; flex-direction: column; }
    .tech-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(13,13,13,0.15); font-family: 'JetBrains Mono', monospace; font-size: 13.5px; }
    .tech-row:last-child { border-bottom: none; }
    .tech-row-key { color: var(--muted); letter-spacing: 1px; }
    .tech-row-val { font-weight: 600; color: var(--ink); }
    .tech-row-val-accent { color: var(--blue); font-weight: 700; }
    .testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .testi { border: 2px solid var(--line); padding: 22px; background: var(--paper); display: flex; flex-direction: column; }
    .testi-quote-mark { font-family: 'JetBrains Mono', monospace; font-size: 36px; color: var(--blue); line-height: 1; margin-bottom: 8px; font-weight: 800; }
    .testi-stars { display: flex; gap: 2px; color: var(--amber); font-size: 14px; margin-bottom: 10px; }
    .testi-quote { font-size: 15px; line-height: 1.7; color: var(--ink-2); margin: 0 0 18px; flex: 1; }
    .testi-author { display: flex; align-items: center; gap: 10px; padding-top: 14px; border-top: 1px dashed var(--line); }
    .testi-avatar { width: 40px; height: 40px; background: var(--ink); color: var(--paper); display: flex; align-items: center; justify-content: center; font-family: 'Noto Kufi Arabic', sans-serif; font-weight: 700; font-size: 15px; flex-shrink: 0; }
    .testi-name { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 14.5px; font-weight: 700; display: block; margin-bottom: 2px; }
    .testi-role { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); }
    .empty-testi { padding: 40px 20px; border: 2px dashed var(--line); text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: var(--muted); }
    .faq { border-top: 2px solid var(--line); }
    .faq-item { border-bottom: 2px solid var(--line); padding: 18px 0; display: grid; grid-template-columns: 50px 1fr; gap: 18px; align-items: start; cursor: pointer; background: transparent; border-left: none; border-right: none; width: 100%; text-align: right; font-family: inherit; transition: background 0.15s ease; }
    .faq-item:hover { background: var(--paper-2); }
    .faq-num { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--blue); font-weight: 700; padding-top: 4px; }
    .faq-body { display: flex; flex-direction: column; gap: 8px; }
    .faq-q { font-family: 'Noto Kufi Arabic', sans-serif; font-size: 17.5px; font-weight: 700; letter-spacing: -0.3px; margin: 0; display: flex; justify-content: space-between; align-items: center; gap: 14px; }
    .faq-toggle { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: var(--blue); flex-shrink: 0; }
    .faq-a { font-size: 14.5px; line-height: 1.75; color: var(--muted); margin: 0; max-width: 720px; }
    .cta-block { border: 2px solid var(--line); background: var(--ink); color: var(--paper); padding: 56px 32px; text-align: center; position: relative; overflow: hidden; }
    .cta-block::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(244,242,236,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,236,0.05) 1px, transparent 1px); background-size: 30px 30px; }
    .cta-block-in { position: relative; z-index: 1; }
    .cta-kicker { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 3px; color: var(--amber); text-transform: uppercase; display: block; margin-bottom: 14px; }
    .cta-title { font-family: 'Noto Kufi Arabic', sans-serif; font-size: clamp(1.9rem, 3.6vw, 3.2rem); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin: 0 0 14px; }
    .cta-title em { color: var(--amber); font-style: normal; }
    .cta-sub { font-size: 16px; color: #999; max-width: 560px; margin: 0 auto 28px; line-height: 1.65; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-actions .btn { border-color: var(--paper); color: var(--paper); }
    .cta-actions .btn:hover { background: var(--paper); color: var(--ink); box-shadow: 4px 4px 0 var(--amber); transform: translate(-2px, -2px); }
    .cta-actions .btn-amber { background: var(--amber); color: var(--ink); border-color: var(--amber); }
    .cta-actions .btn-amber:hover { background: var(--paper); border-color: var(--paper); box-shadow: 4px 4px 0 var(--amber); }
    .foot { border-top: 2px solid var(--line); padding: 44px 0 24px; background: var(--paper); position: relative; z-index: 1; }
    .foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 36px; padding-bottom: 36px; border-bottom: 1px solid rgba(13,13,13,0.15); margin-bottom: 24px; }
    .foot-tag { font-size: 14.5px; line-height: 1.65; color: var(--muted); max-width: 320px; margin: 14px 0 0; }
    .foot-col-title { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin: 0 0 14px; font-weight: 700; }
    .foot-link { display: block; color: var(--ink); text-decoration: none; font-size: 14.5px; padding: 4px 0; transition: color 0.15s ease; }
    .foot-link:hover { color: var(--blue); }
    .foot-bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--muted); letter-spacing: 0.5px; }
    [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
    [data-reveal].revealed { opacity: 1; transform: translateY(0); }
    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; gap: 28px; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .stat:nth-child(2) { border-left: none; }
      .stat:nth-child(3), .stat:nth-child(4) { border-top: 2px solid var(--line); }
      .features { grid-template-columns: repeat(2, 1fr); }
      .feature:nth-child(2n) { border-left: none; }
      .feature:nth-child(3n) { border-left: 2px solid var(--line); }
      .feature { border-bottom: 2px solid var(--line); }
      .feature:nth-last-child(-n+2) { border-bottom: none; }
      .how { grid-template-columns: 1fr; }
      .tech-panel { grid-template-columns: 1fr; }
      .testimonials { grid-template-columns: 1fr 1fr; }
      .foot-grid { grid-template-columns: 1fr 1fr; }
      .lp-nav-links { display: none; }
    }
    @media (max-width: 640px) {
      .section { padding: 40px 0; }
      .hero { padding: 40px 0 24px; }
      .wrap { padding: 0 14px; }
      .stats { grid-template-columns: 1fr; }
      .stat { border-left: none; border-top: 2px solid var(--line); }
      .stat:first-child { border-top: none; }
      .features { grid-template-columns: 1fr; }
      .feature { border-left: none !important; border-bottom: 2px solid var(--line); }
      .feature:last-child { border-bottom: none; }
      .testimonials { grid-template-columns: 1fr; }
      .foot-grid { grid-template-columns: 1fr; gap: 24px; }
      .cta-block { padding: 40px 20px; }
      .faq-item { grid-template-columns: 34px 1fr; gap: 12px; }
      .marquee-track { font-size: 15px; gap: 20px; }
    }
  `
})
export class LandingPage implements OnInit, OnDestroy {
  public auth = inject(AuthService);
  public testimonials = inject(TestimonialService);

  readonly year = new Date().getFullYear();

  stats = signal<IStat[]>([
    { label: 'اختبار مُنشأ', value: '240', hint: '// active_quizzes' },
    { label: 'محاولة مسجلة', value: '12,480', hint: '// total_attempts' },
    { label: 'شركة مسجلة', value: '86', hint: '// companies' },
    { label: 'دقة التقييم', value: '98.4%', hint: '// accuracy_rate' }
  ]);

  features = signal<IFeature[]>([
    { num: '01', title: 'بناء اختبارات ذكي', desc: 'أنشئ أسئلة متعددة الأنواع بنقاط مخصصة وتحكم كامل في التوقيت.', icon: '◆' },
    { num: '02', title: 'تحليلات لحظية', desc: 'قِس أداء المرشحين بدقة مع رسوم بيانية وتقارير تفصيلية.', icon: '▤' },
    { num: '03', title: 'تقييم تلقائي', desc: 'محرك تقييم متعدد الاستراتيجيات يحسب الدرجات فوراً.', icon: '⚙' },
    { num: '04', title: 'إدارة المرشحين', desc: 'تابع المحاولات، أعد التقييم، وقارن النتائج بمرونة تامة.', icon: '▣' },
    { num: '05', title: 'أمان متقدم', desc: 'مصادقة JWT، حماية بمستوى المؤسسات، وتحكم كامل بالصلاحيات.', icon: '⬢' },
    { num: '06', title: 'بنية قابلة للتوسع', desc: 'مبنية على CQRS وMediatR لتنمو مع احتياجاتك بلا حدود.', icon: '⬡' }
  ]);

  steps = signal<IStep[]>([
    { num: '01', title: 'أنشئ الاختبار', desc: 'حدد العنوان، المدة، ثم أضف الأسئلة والخيارات بمرونة كاملة.', time: '// ~2 min' },
    { num: '02', title: 'شارك مع المرشحين', desc: 'أرسل الرابط، وسيبدأ المرشح الاختبار تلقائياً بمؤقت تنازلي.', time: '// instant' },
    { num: '03', title: 'حلّل النتائج', desc: 'اطّلع على الدرجات، متوسطات الأداء، وصعوبة كل سؤال.', time: '// real-time' }
  ]);

  techStack = signal<ITechRow[]>([
    { label: 'Framework', value: '.NET 10 · ASP.NET Core' },
    { label: 'Pattern', value: 'CQRS · MediatR' },
    { label: 'Database', value: 'SQL Server · EF Core' },
    { label: 'Auth', value: 'JWT · HttpOnly Cookies' },
    { label: 'Scoring', value: 'Strategy Pattern' },
    { label: 'Frontend', value: 'Angular 22 · Signals' }
  ]);

  faqs = signal<IFaq[]>([
    { q: 'كيف تختلف SkillForge عن غيرها؟', a: 'نبني كل شيء من الصفر — محرك التقييم، نظام الإحصائيات، وطبقة التحليلات — ببنية نظيفة قابلة للتوسع.' },
    { q: 'هل يمكن استخدام المنصة لأي نوع تقييم؟', a: 'نعم. المنصة تدعم أسئلة الاختيار من متعدد (Single & Multiple Choice) مع استراتيجيات تقييم متعددة.' },
    { q: 'كيف يتم حساب الدرجات والترتيب المئوي؟', a: 'نستخدم خدمة إحصائيات مستقلة تحسب المتوسط، الانحراف المعياري، والترتيب المئوي بشكل فوري عند تسليم كل محاولة.' },
    { q: 'هل بياناتي ونتائج المرشحين آمنة؟', a: 'تماماً. نستخدم JWT مخزّن في HttpOnly cookies، بالإضافة إلى سياسة CORS صارمة.' },
    { q: 'هل يمكنني تجربتها مجاناً؟', a: 'نعم. سجّل حسابك الآن وابدأ بإنشاء اختبارات غير محدودة خلال الفترة التجريبية.' }
  ]);

  openFaq = signal<number | null>(0);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.testimonials.loadPublished(6);

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => this.observer?.observe(el));
    }, 300);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFaq(index: number): void {
    this.openFaq.update(v => v === index ? null : index);
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}