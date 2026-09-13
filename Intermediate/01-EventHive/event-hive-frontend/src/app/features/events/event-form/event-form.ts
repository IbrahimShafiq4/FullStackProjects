import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSerivce } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-event-form',
  styles: `
  
  .form-page {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    padding: 40px 32px 100px;
    overflow: hidden;
  }

  .form-bg {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
    filter: blur(50px);
    pointer-events: none;
  }

  .form-inner {
    position: relative;
    max-width: 780px;
    margin: 0 auto;
    z-index: 1;
  }

  .form-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 40px;
    padding: 8px 14px;
    border-radius: 999px;
    transition: all 0.25s ease;
  }

  .form-back:hover {
    color: var(--accent);
    background: rgba(255, 255, 255, 0.04);
  }

  .form-head {
    margin-bottom: 48px;
  }

  .form-kicker {
    display: inline-block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 12px;
  }

  .form-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -1.2px;
    margin: 0 0 12px;
  }

  .form-title em {
    color: var(--accent);
    font-style: italic;
    font-weight: 700;
  }

  .form-sub {
    color: var(--muted);
    font-size: 15px;
    margin: 0;
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-section {
    padding: 32px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
  }

  .form-section-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  .form-section-num {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -1px;
  }

  .form-section-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-field-full {
    grid-column: 1 / -1;
  }

  .form-field label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-dim);
  }

  .form-field input,
  .form-field textarea {
    width: 100%;
    padding: 14px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 14px;
    transition: all 0.25s ease;
    outline: none;
    font-family: inherit;
    resize: vertical;
  }

  .form-field input::placeholder,
  .form-field textarea::placeholder {
    color: #5a5a60;
  }

  .form-field input:focus,
  .form-field textarea:focus {
    border-color: var(--accent);
    background: var(--surface-3);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .form-btn {
    padding: 14px 28px;
    border-radius: 14px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .form-btn-primary {
    background: var(--accent);
    color: #0a0a0b;
    flex: 1;
  }

  .form-btn-primary:hover {
    background: var(--accent-2);
    box-shadow: 0 16px 40px -16px var(--accent);
    transform: translateY(-1px);
  }

  .form-btn-primary span {
    transition: transform 0.25s ease;
  }

  .form-btn-primary:hover span {
    transform: translateX(-4px);
  }

  .form-btn-ghost {
    background: transparent;
    color: var(--text);
    border-color: var(--border-strong);
  }

  .form-btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text);
  }

  @media (max-width: 640px) {
    .form-page {
        padding: 24px 20px 80px;
    }

    .form-section {
        padding: 24px 20px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-btn {
        width: 100%;
    }
  }

  `,
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