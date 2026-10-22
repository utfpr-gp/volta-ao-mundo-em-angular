import { safeStorage } from './safe-storage';

describe('safeStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('reads back what it wrote', () => {
    expect(safeStorage.write('vmea:test', 'ok')).toBe(true);
    expect(safeStorage.read('vmea:test')).toBe('ok');
  });

  it('read returns null when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(safeStorage.read('vmea:test')).toBeNull();
  });

  it('write returns false when setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(safeStorage.write('vmea:test', 'x')).toBe(false);
  });
});
