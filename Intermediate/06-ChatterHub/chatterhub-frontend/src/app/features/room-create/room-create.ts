import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { RoomsService } from '../../core/services/rooms.service';
import { ToastService } from '../../shared/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { IconComponent } from '../../shared/components/icon/icon/icon';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [FormField, FormsModule, RouterLink, IconComponent],
  templateUrl: './room-create.html',
  styleUrl: './room-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreate {
  private roomsService = inject(RoomsService);
  private toast = inject(ToastService);
  private router = inject(Router);
  readonly theme = inject(ThemeService);

  formModel = signal({ name: '', topic: '' });
  roomForm = form(this.formModel, () => { });

  onSubmit(): void {
    const { name, topic } = this.formModel();
    if (!name.trim()) return;

    this.roomsService.createRoom(name.trim(), topic.trim()).subscribe({
      next: (res) => {
        this.toast.show('Room created', 'success');
        this.router.navigate(['/rooms', res.id]);
      },
      error: () => this.toast.show('Could not create room', 'error'),
    });
  }
}