import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScroll implements OnInit, OnDestroy {
  private _ElementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this._ElementRef.nativeElement.classList.add('reveal-hidden');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this._ElementRef.nativeElement.classList.add('reveal-visible');
          this.observer?.unobserve(this._ElementRef.nativeElement);
        }
      });
    },
    { threshold: 0.15 }
    );

    this.observer.observe(this._ElementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
