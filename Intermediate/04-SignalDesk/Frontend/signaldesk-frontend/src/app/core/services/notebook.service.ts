import { Service, inject, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NOTEBOOK_PAGES, NotebookPage } from '../models/notebook.model';
import { AuthService } from './auth.service';

@Service()
export class NotebookService {
    private router = inject(Router);
    private auth = inject(AuthService);

    readonly currentUrl = toSignal(
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(e => (e as NavigationEnd).urlAfterRedirects),
            startWith(this.router.url)
        ),
        { initialValue: '/' }
    );

    readonly pages = computed<NotebookPage[]>(() => {
        const logged = !!this.auth.currentUser();
        return NOTEBOOK_PAGES.filter(p => p.requiresAuth === logged);
    });

    readonly current = computed<NotebookPage>(() => {
        const url = this.currentUrl();
        const list = this.pages();
        const exact = list.find(p => p.path === url);
        if (exact) return exact;
        const prefix = list.find(p => p.path !== '/' && url.startsWith(p.path));
        return prefix ?? list[0];
    });

    isActive(path: string): boolean {
        return this.currentUrl() === path;
    }
}