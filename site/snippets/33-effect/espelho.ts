// Um signal que só copia outro, mantido por um effect: funciona, mas chega atrasado
readonly visitedCount = signal(0);

constructor() {
  effect(() => this.visitedCount.set(this.saved().visited.length));
}

// O mesmo, com computed: sempre certo, e sem effect nenhum
readonly visitedCount = computed(() => this.saved().visited.length);
