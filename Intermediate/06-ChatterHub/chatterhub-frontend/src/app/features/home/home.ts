import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RoomsService, IRoom } from '../../core/services/rooms.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { PopupService } from '../../shared/services/popup.service';
import { ToastService } from '../../shared/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, IconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  readonly roomsService = inject(RoomsService);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private popup = inject(PopupService);
  private toast = inject(ToastService);
  private router = inject(Router);

  ngOnInit(): void {
    this.roomsService.loadRooms();
  }

  openRoom(room: IRoom): void {
    this.router.navigate(['/rooms', room.id]);
  }

  async onDelete(event: MouseEvent, room: IRoom): Promise<void> {
    event.stopPropagation();
    const confirmed = await this.popup.confirm({
      title: 'Delete room?',
      message: `Delete "${room.name}" and all its messages? This cannot be undone.`,
      type: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    this.roomsService.deleteRoom(room.id).subscribe({
      next: () => {
        this.toast.show('Room deleted', 'success');
        this.roomsService.loadRooms();
      },
    });
  }

  logout(): void { this.auth.logout(); }

  get initial(): string {
    return (this.auth.currentUser()?.fullName ?? 'U').charAt(0).toUpperCase();
  }
}