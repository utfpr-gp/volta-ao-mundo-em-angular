import { isPlatformBrowser } from '@angular/common';
import { Injectable, Injector, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { chapterBySlug } from '../catalog/catalog';
import { safeStorage } from '../shared/safe-storage';

export const PROGRESS_STORAGE_KEY = 'vmea:progress';

export interface ProgressData {
  version: 1;
  /** slug do capítulo → data ISO do primeiro acerto do desafio. */
  stamps: Record<string, string>;
}

export type ImportResult = { ok: true; added: number } | { ok: false; error: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** Lê um passaporte em JSON; devolve null para qualquer coisa que não seja um passaporte válido. */
export function parseProgress(text: string): ProgressData | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const { version, stamps } = value as Record<string, unknown>;
  if (version !== 1 || typeof stamps !== 'object' || stamps === null || Array.isArray(stamps)) return null;
  const entries = Object.entries(stamps);
  if (!entries.every(([, date]) => typeof date === 'string' && ISO_DATE.test(date))) return null;
  return { version: 1, stamps: Object.fromEntries(entries) as Record<string, string> };
}

function mergeStamps(current: Record<string, string>, incoming: Record<string, string>): Record<string, string> {
  const merged = { ...current };
  for (const [slug, date] of Object.entries(incoming)) {
    if (!merged[slug] || date < merged[slug]) merged[slug] = date;
  }
  return merged;
}

/**
 * Os carimbos de quem lê, guardados só no navegador.
 * O HTML pré-gerado não conhece o progresso de ninguém; por isso o armazenamento
 * só é lido depois da primeira renderização, para não atrapalhar a hidratação.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly state = signal<Record<string, string>>({});

  readonly stamps = this.state.asReadonly();
  readonly count = computed(() => Object.keys(this.state()).filter((slug) => chapterBySlug(slug)).length);

  constructor() {
    if (!this.isBrowser) return;
    afterNextRender(() => this.load(), { injector: inject(Injector) });
  }

  hasStamp(slug: string): boolean {
    return slug in this.state();
  }

  stamp(slug: string): void {
    if (this.hasStamp(slug)) return;
    this.state.update((stamps) => ({ ...stamps, [slug]: new Date().toISOString() }));
    this.save();
  }

  exportJson(): string {
    const data: ProgressData = { version: 1, stamps: this.state() };
    return JSON.stringify(data, null, 2);
  }

  importJson(text: string): ImportResult {
    const data = parseProgress(text);
    if (!data) return { ok: false, error: 'Este arquivo não é um passaporte válido.' };
    const before = this.state();
    const added = Object.keys(data.stamps).filter((slug) => !(slug in before)).length;
    this.state.set(mergeStamps(before, data.stamps));
    this.save();
    return { ok: true, added };
  }

  private load(): void {
    const stored = parseProgress(safeStorage.read(PROGRESS_STORAGE_KEY) ?? '');
    if (stored) this.state.update((current) => mergeStamps(stored.stamps, current));
  }

  private save(): void {
    if (this.isBrowser) safeStorage.write(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, stamps: this.state() }));
  }
}
