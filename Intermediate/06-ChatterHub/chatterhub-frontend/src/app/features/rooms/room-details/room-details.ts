import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomsService } from '../../../core/services/rooms.service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-room-details',
  templateUrl: './room-details.html',
})
export class RoomDetails implements OnInit {
  private roomsService = inject(RoomsService);
  private route = inject(ActivatedRoute);
  room = signal<any>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.roomsService.getRoomDetails(id).subscribe({ next: (d) => this.room.set(d) });
  }
}
