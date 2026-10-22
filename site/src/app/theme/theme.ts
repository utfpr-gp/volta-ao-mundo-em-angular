import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { safeStorage } from '../shared/safe-storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'vmea:theme';

/**
 * Modo claro ou escuro. O script em linha do index.html aplica o tema antes do Angular,
 * para a página não piscar; este serviço mantém o atributo data-theme em dia depois disso.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly systemDark = signal(false);
  private readonly storedPreference = signal<ThemePreference>('system');

  readonly preference = this.storedPreference.asReadonly();
  readonly effective = computed<Theme>(() => {
    const preference = this.storedPreference();
    if (preference !== 'system') return preference;
    return this.systemDark() ? 'dark' : 'light';
  });

  constructor() {
    if (!this.isBrowser) return;

    const stored = safeStorage.read(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') this.storedPreference.set(stored);

    const query = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    if (query) {
      this.systemDark.set(query.matches);
      query.addEventListener('change', (event) => this.systemDark.set(event.matches));
    }

    effect(() => {
      this.document.documentElement.dataset['theme'] = this.effective();
    });
  }

  toggle(): void {
    if (!this.isBrowser) return;
    const next: Theme = this.effective() === 'dark' ? 'light' : 'dark';
    this.storedPreference.set(next);
    safeStorage.write(THEME_STORAGE_KEY, next);
    this.document.documentElement.dataset['theme'] = next;
  }
}
