protected startSaving(): void {
  effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saved())));
}
