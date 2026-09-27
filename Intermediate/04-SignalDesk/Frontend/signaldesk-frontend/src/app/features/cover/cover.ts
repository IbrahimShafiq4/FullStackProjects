import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OWNER } from '../../core/models/notebook.model';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-cover',
  standalone: true,
  imports: [RouterLink, HandwrittenUnderline],
  template: `
  <section class="cover">
  <header class="cover-head">
    <span class="cover-tag">كشكول</span>
    <span class="cover-year">{{ owner.year }}</span>
  </header>

  <div class="cover-title">
    <h1 class="cover-main">SignalDesk</h1>
    <p class="cover-sub">
      دفتر تذاكر الدعم الفني
      <app-handwritten-underline />
    </p>
  </div>

  <dl class="cover-fields">
    <div class="field">
      <dt class="field-label">المادة</dt>
      <dd class="field-value">تطوير ويب</dd>
    </div>
    <div class="field">
      <dt class="field-label">الاسم</dt>
      <dd class="field-value">{{ owner.name }}</dd>
    </div>
    <div class="field">
      <dt class="field-label">الدور</dt>
      <dd class="field-value">{{ owner.role }}</dd>
    </div>
    <div class="field">
      <dt class="field-label">السنة</dt>
      <dd class="field-value">{{ owner.year }}</dd>
    </div>
    <div class="field">
      <dt class="field-label">الإيميل</dt>
      <dd class="field-value field-mono" dir="ltr">{{ owner.email }}</dd>
    </div>
    <div class="field">
      <dt class="field-label">الموبايل</dt>
      <dd class="field-value field-mono" dir="ltr">{{ owner.phone }}</dd>
    </div>
  </dl>

  <div class="cover-actions">
    <a routerLink="/login" class="btn-primary">افتح الكشكول</a>
    <a routerLink="/register" class="btn-ghost">حساب جديد</a>
  </div>

  <section class="cover-features">
    <h3 class="sub">إيه اللي جوّه</h3>
    <ul class="features">
      @for (f of features; track f.no) {
        <li class="feature">
          <span class="feature-no">{{ f.no }}</span>
          <div class="feature-body">
            <h4 class="feature-title">{{ f.title }}</h4>
            <p class="feature-text">{{ f.body }}</p>
          </div>
        </li>
      }
    </ul>
  </section>

  <footer class="cover-foot">
    <span class="foot-line"></span>
    <span class="foot-label">كشكول {{ owner.name }} — {{ owner.year }}</span>
    <span class="foot-line"></span>
  </footer>
</section>
  `,
  styles: `
      :host { display: block; }

.cover { display: flex; flex-direction: column; gap: var(--s-6); }

.cover-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--s-2);
  border-bottom: 1.5px solid var(--line-blue);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--ink-blue);
  letter-spacing: 0.08em;
}

.cover-tag {
  padding: 2px var(--s-2);
  border: 1px solid var(--ink-blue);
}

.cover-year { color: var(--pencil); }

.cover-title { padding-block: var(--s-4); }

.cover-main {
  font-size: clamp(2.5rem, 7vw, 5rem) !important;
  line-height: calc(var(--line-size) * 4) !important;
  color: var(--ink) !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em;
}

.cover-sub {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  font-family: var(--font-hand);
  font-size: var(--t-xl);
  color: var(--ink-blue);
  line-height: var(--line-size) !important;
  padding-block-start: var(--s-3);
  border-top: 1px dashed var(--line-blue-soft);
}

.cover-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3) var(--s-6);
  padding: var(--s-5) 0;
  border-top: 1px solid var(--line-blue-soft);
  border-bottom: 1px solid var(--line-blue-soft);
}

.field {
  display: flex;
  align-items: baseline;
  gap: var(--s-3);
  padding-block: var(--s-2);
}

.field-label {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  color: var(--pencil);
  min-width: 56px;
  line-height: 1.5 !important;
}

.field-value {
  font-family: var(--font-body);
  font-size: var(--t-base);
  color: var(--ink);
  font-weight: 500;
  flex: 1;
  border-bottom: 1px solid var(--line-blue-soft);
  padding-bottom: 2px;
  line-height: 1.6 !important;
}

.field-mono { font-family: var(--font-mono); font-size: var(--t-sm); }

.cover-actions { display: flex; gap: var(--s-3); flex-wrap: wrap; }

.cover-features { padding-block-start: var(--s-5); border-top: 1px dashed var(--line-blue-soft); }

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-4) var(--s-6);
}

.feature {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: var(--s-3);
  align-items: baseline;
}

.feature-no {
  font-family: var(--font-hand);
  font-size: var(--t-base);
  color: var(--ink-red);
  line-height: 1.6 !important;
}

.feature-title {
  font-family: var(--font-display);
  font-size: var(--t-base) !important;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: var(--s-1);
  line-height: 1.6 !important;
  background-color: transparent !important;
}

.feature-text {
  font-size: var(--t-sm) !important;
  color: var(--ink-soft);
  line-height: 1.7 !important;
}

.cover-foot {
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding-block-start: var(--s-5);
  font-family: var(--font-hand);
  font-size: var(--t-base);
  color: var(--ink-blue);
  letter-spacing: 0.06em;
}

.foot-line { flex: 1; height: 1px; background: var(--line-blue-soft); }
.foot-label { white-space: nowrap; }

@media (max-width: 700px) {
  .cover-fields { grid-template-columns: 1fr; }
  .features { grid-template-columns: 1fr; }
}
  `,
})
export class Cover {
  readonly owner = OWNER;

  readonly features = [
    { no: '١', title: 'محادثة لحظية', body: 'العميل والوكيل بيتكلموا في نفس اللحظة. مفيش تحديث ولا انتظار.' },
    { no: '٢', title: 'SLA أوتوماتيك', body: 'كل تذكرة بتاخد موعد تسليم حسب أولويتها. العدّاد بيتحرك لوحده.' },
    { no: '٣', title: 'مرفقات كاملة', body: 'صور، فيديو، وصوت. كل نوع بقواعده وأحجامه.' },
    { no: '٤', title: 'ملاحظات داخلية', body: 'الوكلاء بيكتبوا ملاحظات على التذكرة، من غير ما العميل يشوفها.' },
    { no: '٥', title: 'صلاحيات حسب الدور', body: 'العميل بيشوف تذاكره بس. الوكيل بيشوف الكل.' },
    { no: '٦', title: 'تقارير وقياس', body: 'متوسط زمن الرد، نسبة الالتزام بالـ SLA، وتوزيع التذاكر.' },
  ];
}