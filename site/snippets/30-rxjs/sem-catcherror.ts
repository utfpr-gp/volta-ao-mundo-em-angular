this.noteEdits
  .pipe(
    debounceTime(500),
    switchMap(() => this.put()), // se um PUT falhar, o erro desce pela esteira inteira…
  )
  .subscribe({
    next: () => this.saveFailed.set(false),
    error: () => this.saveFailed.set(true), // …e, depois do error, a inscrição acaba
  });
