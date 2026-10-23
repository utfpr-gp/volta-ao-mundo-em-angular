import { computed, signal } from '@angular/core';

const visited = signal(2);         // cria, com o valor inicial 2
console.log(visited());            // lê: 2

visited.set(5);                    // troca o valor
visited.update((n) => n + 1);      // calcula o novo a partir do atual: 6

const percent = computed(() => Math.round((visited() / 195) * 100));
console.log(percent());            // 3
