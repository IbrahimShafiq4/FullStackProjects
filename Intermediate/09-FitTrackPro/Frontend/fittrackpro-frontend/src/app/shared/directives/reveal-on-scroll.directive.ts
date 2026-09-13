import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private _ElementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>)
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this._ElementRef.nativeElement.classList.add('reveal-hidden');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          this._ElementRef.nativeElement.classList.add('reveal-visible');
          this.observer?.unobserve(this._ElementRef.nativeElement);
        }
      }),
      { threshold: 0.15 }
    })

    this.observer.observe(this._ElementRef.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
