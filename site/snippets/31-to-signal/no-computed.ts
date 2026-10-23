protected readonly visible = computed(() => {
  // Um toSignal novo a cada vez que o computed roda: uma inscrição nova a cada vez
  const term = toSignal(this.typed$, { initialValue: '' })();
  return this.countries().filter((country) => country.name.includes(term));
});
