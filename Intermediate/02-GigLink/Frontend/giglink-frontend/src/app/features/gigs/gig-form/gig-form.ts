import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { GigsService, IGig } from '../../../core/services/gigs-service';
import { ToastService } from '../../../core/services/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-gig-form',
  templateUrl: './gig-form.html',
  styles: `
    .gf-panel {
      position: relative;
      padding: 20px 22px 22px;
      border-radius: 6px;
      margin-bottom: 18px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(180, 200, 225, 0.4),
        0 2px 6px rgba(0, 30, 70, 0.1);
      overflow: hidden;
    }

    .gf-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 42%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0.1) 70%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .gf-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .gf-head-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #ffffff;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 3px rgba(0, 30, 70, 0.35),
        0 2px 6px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .gf-title {
      font-family: 'Cairo', sans-serif;
      font-size: 16px;
      font-weight: 800;
      margin: 0;
      color: #0a2949;
      letter-spacing: -0.3px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .gf-grid {
      display: grid;
      grid-template-columns: 1fr 180px;
      gap: 12px;
      position: relative;
    }

    .gf-grid-full {
      grid-template-columns: 1fr;
      margin-bottom: 12px;
    }

    .gf-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .gf-label {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #1e4a7a;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .gf-input,
    .gf-textarea {
      width: 100%;
      padding: 10px 13px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      color: #0a2949;
      background:
        linear-gradient(180deg,
          rgba(235, 244, 252, 0.95) 0%,
          rgba(255, 255, 255, 0.98) 50%,
          rgba(255, 255, 255, 1) 100%);
      border: 1px solid rgba(120, 155, 195, 0.7);
      border-radius: 4px;
      outline: none;
      transition: all 0.2s ease;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        inset 0 -1px 0 rgba(255, 255, 255, 0.7);
    }

    .gf-textarea {
      resize: vertical;
      min-height: 90px;
      line-height: 1.6;
    }

    .gf-input::placeholder,
    .gf-textarea::placeholder {
      color: #8ba4c2;
      font-weight: 500;
    }

    .gf-input:focus,
    .gf-textarea:focus {
      border-color: var(--blue);
      background: #ffffff;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        0 0 0 3px rgba(90, 160, 240, 0.35),
        0 0 12px rgba(90, 160, 240, 0.5);
    }

    .gf-btn {
      position: relative;
      width: 100%;
      padding: 11px 18px;
      margin-top: 12px;
      border-radius: 5px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border: 1px solid #0e3e73;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 30, 70, 0.35),
        0 3px 10px rgba(30, 90, 180, 0.4);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .gf-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 46%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 5px 5px 50% 50% / 5px 5px 20px 20px;
      pointer-events: none;
    }

    .gf-btn:hover {
      background:
        linear-gradient(180deg,
          #a8d5ff 0%,
          #5aa0e8 44%,
          #3a88d8 50%,
          #2a6eb8 51%,
          #4a92e0 100%);
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 -2px 4px rgba(0, 30, 70, 0.4),
        0 5px 14px rgba(30, 90, 180, 0.5),
        0 0 20px rgba(90, 160, 240, 0.5);
    }

    .gf-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .gf-panel { padding: 16px 16px 18px; }
      .gf-grid { grid-template-columns: 1fr; }
    }
  `
})
export class GigForm {
  private _GigsService: GigsService = inject(GigsService);
  private _ToastService: ToastService = inject(ToastService);

  gigCreated: OutputEmitterRef<void> = output<void>();

  formModel = { title: '', description: '', budget: 0 };
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onSubmit(): void {
    const { title, description, budget } = this.formModel;

    if (!title.trim() || !description.trim() || budget <= 0) {
      this._ToastService.show('لازم تملى كل الحقول بشكل صحيح', 'error');
      return;
    }

    this.isSubmitting.set(true);

    this._GigsService.createGig(title, description, budget).subscribe({
      next: (gig: IGig) => {
        this._ToastService.show('تم نشر المهمة بنجاح', 'success');
        this.formModel = { title: '', description: '', budget: 0 };
        this.isSubmitting.set(false);
        this.gigCreated.emit();
      },
      error: (error: HttpErrorResponse) => {
        this._ToastService.show('حصل خطأ أثناء النشر', 'error');
        this.isSubmitting.set(false);
      }
    });
  }
}