import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactChannel } from '../../core/models/notebook.model';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, HandwrittenUnderline],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  readonly channels: ContactChannel[] = [
    { label: 'البريد', value: 'ibrahim.shafiq@gmail.com', href: 'mailto:roa@yasser.dev' },
    { label: 'GitHub', value: 'https://github.com/IbrahimShafiq4', href: 'https://github.com' },
    { label: 'LinkedIn', value: 'https://www.linkedin.com/in/ibrahim-shafiq/', href: 'https://linkedin.com' },
    { label: 'الموبايل', value: '+٢٠ ١٠٠ ٠٠٠ ٠٠٠٠', href: 'tel:+201000000000' },
  ];

  readonly hours: { day: string; time: string }[] = [
    { day: 'الأحد — الخميس', time: '٩ص — ٦م' },
    { day: 'الجمعة والسبت', time: 'مغلق' },
  ];

  name = signal('');
  email = signal('');
  body = signal('');
  sent = signal(false);

  submit() {
    if (!this.name().trim() || !this.email().trim() || !this.body().trim()) return;

    this.sent.set(true);
    this.name.set('');
    this.email.set('');
    this.body.set('');

    setTimeout(() => this.sent.set(false), 3200);
  }
}