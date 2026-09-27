import {
  Component, ElementRef, OnDestroy, OnInit, viewChild, inject,
  PLATFORM_ID, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface SandGrain {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  life: number; maxLife: number;
}

@Component({
  selector: 'app-sand-particles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="sand-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    .sand-canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      opacity: 0.55;
    }
  `],
})
export class SandParticles implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx: CanvasRenderingContext2D | null = null;
  private grains: SandGrain[] = [];
  private rafId: number = 0;
  private resizeHandler?: () => void;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) this.spawn(true);

    this.loop();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  private spawn(initial: boolean = false): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const maxLife = 200 + Math.random() * 300;
    this.grains.push({
      x: Math.random() * canvas.width,
      y: initial ? Math.random() * canvas.height : canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.15 - Math.random() * 0.35,
      size: 0.5 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.4,
      life: 0, maxLife,
    });
  }

  private loop = (): void => {
    const canvas = this.canvasRef()?.nativeElement;
    const ctx = this.ctx;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = document.documentElement.classList.contains('dark');
    const gold = isDark ? '212,145,15' : '166,130,31';

    for (let i = this.grains.length - 1; i >= 0; i--) {
      const g = this.grains[i];
      g.x += g.vx;
      g.y += g.vy;
      g.life++;

      const fade = 1 - g.life / g.maxLife;
      if (fade <= 0 || g.y < -20) {
        this.grains.splice(i, 1);
        this.spawn();
        continue;
      }

      ctx.beginPath();
      ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${gold},${g.alpha * fade})`;
      ctx.fill();
    }

    while (this.grains.length < 60) this.spawn();

    this.rafId = requestAnimationFrame(this.loop);
  };
}