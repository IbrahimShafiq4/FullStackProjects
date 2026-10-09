import {
  Component,
  HostListener,
  ElementRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell implements OnInit {
  public svc = inject(NotificationsService);
  private host = inject(ElementRef<HTMLElement>);

  isOpen = signal(false);

  ngOnInit(): void {
    this.svc.load();
    setInterval(() => this.svc.load(), 60_000);
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.host.nativeElement.contains(ev.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.isOpen.set(false);
  }

  async openItem(id: number): Promise<void> {
    await this.svc.markAsRead(id);
  }
}