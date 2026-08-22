import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IEvent } from '../../../core/services/event';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-event-card',
  styles: ``,
  templateUrl: './event-card.html',
})
export class EventCard {
  event:        InputSignal<IEvent>       = input.required<IEvent>();
  onRsvp:       OutputEmitterRef<number>  = output<number>();
  onCancelRsvp: OutputEmitterRef<number>  = output<number>();
  onDelete:     OutputEmitterRef<number>  = output<number>();
}
