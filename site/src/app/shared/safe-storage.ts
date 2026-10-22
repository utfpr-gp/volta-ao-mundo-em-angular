/**
 * Acesso ao localStorage que nunca lança exceção.
 * O armazenamento pode estar bloqueado (modo privado, política do navegador),
 * cheio ou ausente (pré-renderização); nesses casos o site segue funcionando sem ele.
 */
export const safeStorage = {
  read(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },

  write(key: string, value: string): boolean {
    try {
      globalThis.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};
