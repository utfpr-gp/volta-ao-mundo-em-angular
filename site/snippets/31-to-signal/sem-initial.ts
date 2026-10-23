// Sem o initialValue: até o primeiro valor chegar, o signal vale undefined
protected readonly term = toSignal(toObservable(this.searchText).pipe(debounceTime(300)));

// …e o TypeScript avisa onde isso quebra
simplify(country.name).includes(this.term());
