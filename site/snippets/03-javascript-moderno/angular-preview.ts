protected readonly visitedNames = computed(() =>
  this.countries()
    .filter((c) => c.visited)
    .map((c) => `${c.flag} ${c.name}`),
);
