import { Component, inject, OnInit, signal } from '@angular/core';
import { StatsService, IOverviewStats } from '../../core/services/stats.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="bg-white text-gray-800">
      <!-- Hero -->
      <section class="relative overflow-hidden px-4 pt-16 pb-24 text-center bg-gradient-to-b from-surface-muted to-white">
        <div class="max-w-4xl mx-auto relative">
          <h1 class="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            <span class="text-brand-600">MindMesh</span><br>
            <span class="text-gray-800">لوحة ذهنية تعاونية</span>
          </h1>
          <p class="text-base md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            نظّم أفكارك، خطّط مشاريعك، وتعاون مع فريقك في مكان واحد. تصميم أنيق وسهل الاستخدام.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a routerLink="/register" class="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-apple-lg">ابدأ مجاناً</a>
            <a routerLink="/login" class="bg-surface-muted hover:bg-surface-border text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">تسجيل دخول</a>
          </div>
          <div class="mt-12 flex justify-center">
            <img src="https://esome.co.kr/assets/mindmesh-DxeWHzv0.jpg" 
                alt="خريطة ذهنية تعاونية - MindMesh" 
                class="rounded-lg shadow-apple-xl border border-surface-border max-w-full">
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        <div class="bg-surface-muted flex flex-col flex-wrap items-end p-5 rounded-lg border border-surface-border hover:shadow-apple-lg transition-all">
          <div class="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-2xl mb-4">🧠</div>
          <h3 class="text-xl font-bold text-gray-900">بطاقات ذكية</h3>
          <p class="text-gray-600 text-end mt-2 leading-relaxed text-sm">أنشئ بطاقات تحتوي على نصوص، روابط، وألوان مختلفة لتنظيم أفكارك بسهولة.</p>
        </div>
        <div class="bg-surface-muted flex flex-col flex-wrap items-end p-5 rounded-lg border border-surface-border hover:shadow-apple-lg transition-all">
          <div class="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-2xl mb-4">🔗</div>
          <h3 class="text-xl font-bold text-gray-900">روابط متصلة</h3>
          <p class="text-gray-600 text-end mt-2 leading-relaxed text-sm">اربط البطاقات ببعضها لإنشاء خريطة ذهنية متكاملة تعكس تدفق أفكارك.</p>
        </div>
        <div class="bg-surface-muted flex flex-col flex-wrap items-end p-5 rounded-lg border border-surface-border hover:shadow-apple-lg transition-all">
          <div class="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-2xl mb-4">👥</div>
          <h3 class="text-xl font-bold text-gray-900">تعاون فوري</h3>
          <p class="text-gray-600 text-end mt-2 leading-relaxed text-sm">شارك لوحتك مع فريقك واعملوا معاً في الوقت الفعلي، كل التغييرات تنعكس لحظياً.</p>
        </div>
        <div class="bg-surface-muted p-5 rounded-lg border border-surface-border hover:shadow-apple-lg transition-all md:col-span-3">
          <div class="flex items-center gap-4" dir="rtl">
            <div class="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-2xl flex-shrink-0">📊</div>
            <div>
              <h3 class="text-start text-xl font-bold text-gray-900">تحليلات متقدمة</h3>
              <p class="text-start text-gray-600 mt-1 leading-relaxed text-sm">تتبع أداء لوحتك من خلال إحصائيات مفصلة عن عدد البطاقات والروابط والألوان الأكثر استخداماً.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      @if (stats(); as stats) {
        <section class="bg-surface-muted border-y border-surface-border py-12">
          <div class="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p class="text-3xl font-black text-brand-600">{{ stats.totalUsers }}</p>
              <p class="text-gray-500 text-sm mt-1">مستخدم</p>
            </div>
            <div>
              <p class="text-3xl font-black text-brand-600">{{ stats.totalBoards }}</p>
              <p class="text-gray-500 text-sm mt-1">لوحة</p>
            </div>
            <div>
              <p class="text-3xl font-black text-brand-600">{{ stats.totalCards }}</p>
              <p class="text-gray-500 text-sm mt-1">بطاقة</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">آخر تحديث</p>
              <p class="font-semibold text-gray-900 mt-1">{{ stats.lastUpdated | date:'short' }}</p>
            </div>
          </div>
        </section>
      }

      <!-- Testimonials -->
      <section class="max-w-5xl mx-auto px-4 py-16">
        <h2 class="text-2xl font-black text-center text-gray-900 mb-12">ما يقولونه عنا</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-end *:text-end bg-white border border-surface-border rounded-lg p-5 shadow-apple">
            <p class="text-gray-700 leading-relaxed text-sm">"منصة رائعة ساعدتني في تنظيم مشاريعي بشكل لم أتخيله. التصميم أنيق وسهل."</p>
            <div class="mt-4 flex items-center gap-3" dir="rtl">
              <div class="w-9 h-9 rounded-lg bg-brand-200 flex items-center justify-center font-bold text-brand-700">أ</div>
              <div>
                <p class="font-semibold text-gray-900">أحمد محمد</p>
                <p class="text-xs text-gray-500">مصمم جرافيك</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end *:text-end bg-white border border-surface-border rounded-lg p-5 shadow-apple">
            <p class="text-gray-700 leading-relaxed text-sm">"التعاون الفوري مع فريقي أصبح ممتعاً وسلساً. أنصح بها بشدة."</p>
            <div class="mt-4 flex items-center gap-3" dir="rtl">
              <div class="w-9 h-9 rounded-lg bg-brand-200 flex items-center justify-center font-bold text-brand-700">س</div>
              <div>
                <p class="font-semibold text-gray-900">سارة خالد</p>
                <p class="text-xs text-gray-500">مديرة مشاريع</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end *:text-end bg-white border border-surface-border rounded-lg p-5 shadow-apple">
            <p class="text-gray-700 leading-relaxed text-sm">"أفضل أداة رسم خرائط ذهنية استخدمتها على الإطلاق. بسيطة وقوية."</p>
            <div class="mt-4 flex items-center gap-3" dir="rtl">
              <div class="w-9 h-9 rounded-lg bg-brand-200 flex items-center justify-center font-bold text-brand-700">م</div>
              <div>
                <p class="font-semibold text-gray-900">محمد علي</p>
                <p class="text-xs text-gray-500">مطور برمجيات</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end *:text-end bg-white border border-surface-border rounded-lg p-5 shadow-apple">
            <p class="text-gray-700 leading-relaxed text-sm">"تجربة المستخدم رائعة، والواجهة نظيفة جداً. أوصي بها لكل الفرق."</p>
            <div class="mt-4 flex items-center gap-3" dir="rtl">
              <div class="w-9 h-9 rounded-lg bg-brand-200 flex items-center justify-center font-bold text-brand-700">ن</div>
              <div>
                <p class="font-semibold text-gray-900">نورة عبدالله</p>
                <p class="text-xs text-gray-500">محللة أعمال</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto px-4 py-16">
        <h2 class="text-2xl font-black text-center text-gray-900 mb-10">الأسئلة الشائعة</h2>
        <div class="space-y-4">
          <div class="border border-surface-border rounded-lg p-4 bg-surface-muted">
            <h3 class="text-base font-bold text-end text-gray-900">ما هي MindMesh؟</h3>
            <p class="text-gray-600 mt-1 text-end text-sm">MindMesh هي منصة للخرائط الذهنية التعاونية تتيح لك إنشاء بطاقات وربطها وتنظيمها بشكل بصري مع فريقك.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-4 bg-surface-muted">
            <h3 class="text-base font-bold text-end text-gray-900">هل الخدمة مجانية؟</h3>
            <p class="text-gray-600 mt-1 text-end text-sm">نعم، يمكنك البدء مجاناً والاستمتاع بجميع الميزات الأساسية. خطط مدفوعة لمزيد من الميزات المتقدمة.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-4 bg-surface-muted">
            <h3 class="text-base font-bold text-end text-gray-900">كيف يمكنني التعاون مع فريقي؟</h3>
            <p class="text-gray-600 mt-1 text-end text-sm">ببساطة قم بإنشاء لوحة وشارك الرابط مع أعضاء فريقك، وستظهر التغييرات في الوقت الفعلي.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-4 bg-surface-muted">
            <h3 class="text-base font-bold text-end text-gray-900">هل يمكنني تغيير لون البطاقات؟</h3>
            <p class="text-gray-600 mt-1 text-end text-sm">نعم، عند إنشاء بطاقة يمكنك اختيار لونها من القائمة المنسدلة، كما يمكن تغييرها لاحقاً.</p>
          </div>
          <div class="border border-surface-border rounded-lg p-4 bg-surface-muted">
            <h3 class="text-base font-bold text-end text-gray-900">كيف أبدأ؟</h3>
            <p class="text-gray-600 mt-1 text-end text-sm">ما عليك سوى إنشاء حساب، ثم إنشاء لوحة جديدة وابدأ بإضافة بطاقاتك وتنظيمها.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-brand-600 text-white py-16 text-center">
        <div class="max-w-2xl mx-auto px-4">
          <h2 class="text-3xl font-black">جاهز لتنظيم أفكارك؟</h2>
          <p class="text-base text-white/80 mt-3">انضم إلى آلاف المستخدمين الذين يثقون في MindMesh.</p>
          <a routerLink="/register" class="inline-block mt-6 bg-white text-brand-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-apple-xl">ابدأ الآن مجاناً</a>
        </div>
      </section>
    </div>
  `
})
export class LandingPage implements OnInit {
  private statsService = inject(StatsService);
  stats = signal<IOverviewStats | null>(null);

  ngOnInit() {
    this.statsService.getOverview().subscribe({
      next: (data) => this.stats.set(data),
      error: () => console.error('Failed to load stats')
    });
  }
}