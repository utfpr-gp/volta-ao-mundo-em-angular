import { isChunkLoadError, reloadOnce } from './chunk-reload';

describe('chunk reload', () => {
  it('recognizes the chunk errors of Chrome, Firefox and Safari', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/chunk-A.js'))).toBe(true);
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module: https://x/chunk-A.js'))).toBe(true);
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });

  it('reloads the page once per address, never in a loop', () => {
    const storage = new Map<string, string>();
    const store = { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => void storage.set(k, v) };
    const reload = vi.fn();
    expect(reloadOnce('/capitulos/08', store, reload)).toBe(true);
    expect(reload).toHaveBeenCalledWith('/capitulos/08');
    expect(reloadOnce('/capitulos/08', store, reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
