import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PROGRESS_STORAGE_KEY, ProgressService, parseProgress } from './progress';

const store = (value: unknown) =>
  localStorage.setItem(PROGRESS_STORAGE_KEY, typeof value === 'string' ? value : JSON.stringify(value));

/** O serviço só lê o armazenamento depois da primeira renderização (afterNextRender). */
function loadedService(): ProgressService {
  const service = TestBed.inject(ProgressService);
  TestBed.tick();
  return service;
}

describe('parseProgress', () => {
  it('accepts a valid passport', () => {
    expect(parseProgress('{"version":1,"stamps":{"01-o-que-e-o-angular":"2026-10-22T12:00:00.000Z"}}')).toEqual({
      version: 1,
      stamps: { '01-o-que-e-o-angular': '2026-10-22T12:00:00.000Z' },
    });
  });

  it('rejects invalid JSON, wrong version, stamps not an object and non-ISO dates', () => {
    expect(parseProgress('{oops')).toBeNull();
    expect(parseProgress('null')).toBeNull();
    expect(parseProgress('{"version":2,"stamps":{}}')).toBeNull();
    expect(parseProgress('{"version":1,"stamps":[]}')).toBeNull();
    expect(parseProgress('{"version":1,"stamps":{"01-o-que-e-o-angular":"ontem"}}')).toBeNull();
    expect(parseProgress('{"version":1,"stamps":{"01-o-que-e-o-angular":42}}')).toBeNull();
  });
});

describe('ProgressService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('starts empty when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(loadedService().count()).toBe(0);
  });

  it('starts empty when storage holds garbage', () => {
    store('{isso não é json');
    expect(loadedService().count()).toBe(0);
  });

  it('loads the stored stamps after the first render', () => {
    store({ version: 1, stamps: { '09-signals': '2026-10-01T10:00:00.000Z' } });
    const service = TestBed.inject(ProgressService);
    expect(service.hasStamp('09-signals')).toBe(false);
    TestBed.tick();
    expect(service.hasStamp('09-signals')).toBe(true);
  });

  it('does not read storage before afterNextRender', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    TestBed.inject(ProgressService);
    expect(getItem).not.toHaveBeenCalled();
    TestBed.tick();
    expect(getItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY);
  });

  it('never reads storage on the server', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    TestBed.inject(ProgressService);
    TestBed.tick();
    expect(getItem).not.toHaveBeenCalled();
  });

  it('stamp() saves and keeps the first date when called twice', () => {
    vi.useFakeTimers({ now: new Date('2026-10-01T10:00:00.000Z'), toFake: ['Date'] });
    const service = loadedService();
    service.stamp('09-signals');
    vi.setSystemTime(new Date('2026-10-20T10:00:00.000Z'));
    service.stamp('09-signals');
    vi.useRealTimers();
    expect(service.stamps()['09-signals']).toBe('2026-10-01T10:00:00.000Z');
    expect(parseProgress(localStorage.getItem(PROGRESS_STORAGE_KEY)!)!.stamps['09-signals']).toBe(
      '2026-10-01T10:00:00.000Z',
    );
  });

  it('stamp() still works when storage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const service = loadedService();
    service.stamp('09-signals');
    expect(service.hasStamp('09-signals')).toBe(true);
  });

  it('count ignores slugs that are not in the catalog', () => {
    store({ version: 1, stamps: { '09-signals': '2026-10-01T10:00:00.000Z', '77-capitulo-antigo': '2026-10-01T10:00:00.000Z' } });
    expect(loadedService().count()).toBe(1);
  });

  it('importJson merges, keeps earliest dates and reports how many were added', () => {
    store({ version: 1, stamps: { '09-signals': '2026-10-05T10:00:00.000Z' } });
    const service = loadedService();
    const result = service.importJson(
      JSON.stringify({ version: 1, stamps: { '09-signals': '2026-10-01T10:00:00.000Z', '10-if-e-switch': '2026-10-02T10:00:00.000Z' } }),
    );
    expect(result).toEqual({ ok: true, added: 1 });
    expect(service.stamps()).toEqual({
      '09-signals': '2026-10-01T10:00:00.000Z',
      '10-if-e-switch': '2026-10-02T10:00:00.000Z',
    });
  });

  it('importJson leaves progress unchanged on error', () => {
    const service = loadedService();
    service.stamp('09-signals');
    const before = service.stamps();
    expect(service.importJson('{"version":1,"stamps":"nada"}')).toEqual({
      ok: false,
      error: 'Este arquivo não é um passaporte válido.',
    });
    expect(service.stamps()).toEqual(before);
  });

  it('exportJson round-trips through importJson', () => {
    const first = loadedService();
    first.stamp('09-signals');
    first.stamp('10-if-e-switch');
    const exported = first.exportJson();
    localStorage.clear();
    TestBed.resetTestingModule();
    const second = loadedService();
    expect(second.importJson(exported)).toEqual({ ok: true, added: 2 });
    expect(second.stamps()).toEqual(first.stamps());
  });
});
