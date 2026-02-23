import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'lms_theme';

  isDark = signal(this.loadPreference());

  constructor() {
    // Apply theme class whenever isDark changes
    effect(() => {
      const dark = this.isDark();
      document.body.classList.toggle('dark-theme', dark);
      localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private loadPreference(): boolean {
    if (typeof localStorage === 'undefined') return false;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';

    // Respect system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}
