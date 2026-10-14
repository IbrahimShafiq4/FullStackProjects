import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuctionsService } from '../../core/services/auctions.service';
import { AuthService } from '../../core/services/auth.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

interface FaqItem { q: string; a: string; open: boolean; }
interface Category { label: string; count: number; icon: string; }

@Component({
  imports: [RouterLink, CurrencyPipe, RevealOnScrollDirective],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  auctions = inject(AuctionsService);
  auth = inject(AuthService);

  faq = signal<FaqItem[]>([
    { q: 'هل المزايدة تحدث لحظيًا فعلًا؟', a: 'نعم. عند وصول أي مزايدة جديدة، يظهر الرقم في صفحتك خلال أقل من 200 مللي ثانية عبر SignalR دون تحديث الصفحة.', open: true },
    { q: 'ماذا يحدث عند انتهاء وقت المزاد؟', a: 'يُغلق المزاد تلقائيًا خلال 30 ثانية من انتهاء الوقت، يُحدد الفائز بناءً على أعلى مزايدة، ويُعلن الاسم في الصفحة مباشرة.', open: false },
    { q: 'هل يمكنني المزايدة على مزادي الخاص؟', a: 'لا. النظام يرفض تلقائيًا أي محاولة مزايدة من صاحب المزاد نفسه.', open: false },
    { q: 'ما الحد الأدنى للزيادة؟', a: 'جنيه واحد. أي مزايدة أقل من (أعلى مزايدة حالية + 1) تُرفض مع رسالة توضح السبب.', open: false },
    { q: 'كيف أرفع صور أو فيديو للمزاد؟', a: 'حتى 6 ملفات بحد أقصى 15 ميجا للملف. الأنواع المدعومة: JPG, PNG, WEBP, MP4, WEBM, MOV.', open: false },
  ]);

  categories: Category[] = [
    { label: 'إلكترونيات', count: 42, icon: 'device' },
    { label: 'ساعات', count: 18, icon: 'watch' },
    { label: 'سيارات', count: 7, icon: 'car' },
    { label: 'فنون', count: 26, icon: 'art' },
    { label: 'مقتنيات', count: 33, icon: 'gem' },
    { label: 'رياضة', count: 12, icon: 'sport' },
  ];

  stats = [
    { value: '1.2K+', label: 'مزاد مكتمل' },
    { value: '8.4K', label: 'مزايدة مسجّلة' },
    { value: '< 200ms', label: 'زمن البث' },
    { value: '99.9%', label: 'استقرار الاتصال' },
  ];

  ngOnInit() {
    this.auctions.loadPopular();
    this.auctions.load();
  }

  get tickerItems() {
    const top = this.auctions.popular().slice(0, 8);
    const fallback = this.auctions.auctions().slice(0, 8);
    const list = (top.length ? top : fallback) as any[];
    return [...list, ...list];
  }

  get previewAuctions() {
    return this.auctions.auctions().slice(0, 6);
  }

  get isLoggedIn() {
    return !!this.auth.currentUser();
  }

  toggleFaq(i: number) {
    this.faq.update(list => list.map((f, idx) => idx === i ? { ...f, open: !f.open } : f));
  }

  readonly heroStats = computed(() => this.stats);
}