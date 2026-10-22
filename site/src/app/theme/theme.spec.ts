import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';

function mockSystemDark(dark: boolean) {
  const listeners: ((event: { matches: boolean }) => void)[] = [];
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: dark,
      addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => listeners.push(listener),
      removeEventListener: vi.fn(),
    }),
  );
  return (matches: boolean) => listeners.forEach((listener) => listener({ matches }));
}

describe('ThemeService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('starts with preference "system" when nothing is stored', () => {
    mockSystemDark(false);
    const theme = TestBed.inject(ThemeService);
    expect(theme.preference()).toBe('system');
  });

  it('effective follows matchMedia when preference is system', () => {
    const changeSystem = mockSystemDark(true);
    const theme = TestBed.inject(ThemeService);
    expect(theme.effective()).toBe('dark');
    changeSystem(false);
    TestBed.tick();
    expect(theme.effective()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('uses the stored preference', () => {
    mockSystemDark(false);
    localStorage.setItem('vmea:theme', 'dark');
    const theme = TestBed.inject(ThemeService);
    expect(theme.preference()).toBe('dark');
    expect(theme.effective()).toBe('dark');
  });

  it('ignores a corrupted stored preference', () => {
    mockSystemDark(false);
    localStorage.setItem('vmea:theme', 'roxo');
    const theme = TestBed.inject(ThemeService);
    expect(theme.preference()).toBe('system');
  });

  it('toggle() from effective light stores "dark" under vmea:theme and sets data-theme="dark"', () => {
    mockSystemDark(false);
    const theme = TestBed.inject(ThemeService);
    theme.toggle();
    expect(localStorage.getItem('vmea:theme')).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(theme.effective()).toBe('dark');
  });

  it('does not touch document or storage on the server platform', () => {
    const matchMedia = vi.fn();
    vi.stubGlobal('matchMedia', matchMedia);
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const theme = TestBed.inject(ThemeService);
    theme.toggle();
    expect(getItem).not.toHaveBeenCalled();
    expect(matchMedia).not.toHaveBeenCalled();
    expect(document.documentElement.dataset['theme']).toBeUndefined();
  });
});
