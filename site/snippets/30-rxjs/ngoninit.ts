ngOnInit(): void {
  this.typed.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(...);
}
