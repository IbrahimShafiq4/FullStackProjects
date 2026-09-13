import { Component, inject, OnInit } from '@angular/core';
import { RoomsService } from '../../../../core/services/rooms.service';
import { RouterLink } from '@angular/router';
import { PopupService } from '../../../../shared/services/popup.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  imports: [RouterLink],
  selector: 'app-room-list',
  templateUrl: './room-list.html',
})
export class RoomList implements OnInit {
  roomsService = inject(RoomsService);
  private popup = inject(PopupService);
  private toast = inject(ToastService);

  ngOnInit() { this.roomsService.loadRooms(); }

  async onDelete(id: number) {
    const confirmed = await this.popup.confirm({ title: 'حذف الغرفة', message: 'هل أنت متأكد؟', type: 'danger' });
    if (confirmed) {
      this.roomsService.deleteRoom(id).subscribe({ next: () => { this.toast.show('تم الحذف', 'success'); this.roomsService.loadRooms(); } });
    }
  }
}
