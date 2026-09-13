import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({ selector: '[appRevealOnScroll]', standalone: true })
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) this.el.nativeElement.classList.add('opacity-100'); }),
      { threshold: 0.1 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
