readonly visits = signal(0);

constructor() {
  // O effect lê visits e escreve em visits: ele mesmo se chama de novo, para sempre
  effect(() => this.visits.set(this.visits() + 1));
}
