effect((onCleanup) => {
  const text = this.saved();
  // Espera 1 s sem mudanças para gravar; se mudar antes, o onCleanup cancela a gravação anterior
  const timer = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(text)), 1000);
  onCleanup(() => clearTimeout(timer));
});
