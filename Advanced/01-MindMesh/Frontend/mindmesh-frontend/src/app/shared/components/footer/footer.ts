import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-surface-border bg-white py-8">
      <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p class="font-light">© {{ currentYear }} MindMesh. جميع الحقوق محفوظة.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-gray-900 transition-colors">سياسة الخصوصية</a>
            <a href="#" class="hover:text-gray-900 transition-colors">شروط الاستخدام</a>
            <a href="#" class="hover:text-gray-900 transition-colors">تواصل معنا</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  currentYear = new Date().getFullYear();
}