import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private _El: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this._El.nativeElement.classList.add('reveal-hidden');
    this.observer = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { 
        this._El.nativeElement.classList.add('reveal-visible'); 
        this.observer?.unobserve(this._El.nativeElement); 
      }
    }), 
    { threshold: 0.15 });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
