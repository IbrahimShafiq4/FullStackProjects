import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { RoomsService } from '../../../../core/services/rooms.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule],
  selector: 'app-room-create',
  styles: ``,
  templateUrl: './room-create.html',
})
export class RoomCreate {
  private roomsService = inject(RoomsService);
  private toast = inject(ToastService);
  private router = inject(Router);
  formModel = signal({ name: '', topic: '' });
  roomForm = form(this.formModel, () => { });

  onSubmit() {
    const { name, topic } = this.formModel();
    this.roomsService.createRoom(name, topic).subscribe({
      next: () => { this.toast.show('تم إنشاء الغرفة', 'success'); this.router.navigate(['/rooms']); }
    });
  }
}