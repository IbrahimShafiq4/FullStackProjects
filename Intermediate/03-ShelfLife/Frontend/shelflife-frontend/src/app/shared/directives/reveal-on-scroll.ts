import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private _El: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.onObserve();
  }

  onObserve(): void {
    this._El.nativeElement.classList.add('reveal-hidden');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
            this._El.nativeElement.classList.add('reveal-visible');
            this.observer?.unobserve(this._El.nativeElement);
          }
        });
      },
      { threshold: 0.3 }
    );
    this.observer.observe(this._El.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
