import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({ selector: '[appRevealOnScroll]' })
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private host: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.host.nativeElement.style.opacity = '0';
    this.host.nativeElement.style.transform = 'translateY(24px)';
    this.host.nativeElement.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1)';

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'translateY(0)';
          this.observer?.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}