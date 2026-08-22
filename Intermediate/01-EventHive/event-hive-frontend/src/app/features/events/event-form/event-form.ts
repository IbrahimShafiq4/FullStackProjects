import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSerivce } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-event-form',
  styles: ``,
  templateUrl: './event-form.html',
})
export class EventForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventSerivce);
  private toast = inject(Toast);

  isEditMode = signal(false);
  eventId = signal<number | null>(null);

  model = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: 10,
    location: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.eventId.set(Number(id));
      this.eventService.getEventById(Number(id)).subscribe({
        next: (data) => {
          this.model.title = data.title;
          this.model.description = data.description || '';
          this.model.startDate = new Date(data.startDate).toISOString().slice(0, 16);
          this.model.endDate = new Date(data.endDate).toISOString().slice(0, 16);
          this.model.capacity = data.capcity;
          this.model.location = data.location || '';
        },
        error: () => this.toast.show('فشل تحميل البيانات', 'error')
      });
    }
  }

  onSubmit() {
    const formData = {
      title: this.model.title,
      description: this.model.description,
      startDate: new Date(this.model.startDate).toISOString(),
      endDate: new Date(this.model.endDate).toISOString(),
      capacity: this.model.capacity,
      location: this.model.location
    };

    const request$ = this.isEditMode()
      ? this.eventService.updateEvent(this.eventId()!, formData)
      : this.eventService.createEvent(formData);

    request$.subscribe({
      next: () => {
        this.toast.show(this.isEditMode() ? 'تم التحديث ✅' : 'تم الإنشاء 🎉', 'success');
        this.router.navigate(['/events']);
      },
      error: (err) => this.toast.show(err.error || 'حدث خطأ', 'error')
    });
  }
}
