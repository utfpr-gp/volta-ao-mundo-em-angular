import { SchemaPath, validate } from '@angular/forms/signals';

/** A data de hoje no fuso de quem usa o app, no formato que o campo de data usa: AAAA-MM-DD. */
export function today(): string {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

/**
 * Um nome de pessoa: letras de qualquer alfabeto, com ou sem acento (\p{L}), espaço, apóstrofo e hífen.
 * O ^ e o $ obrigam o texto inteiro a seguir a regra. O * aceita o campo vazio, porque a companhia é opcional.
 */
export const NAME_PATTERN = /^[\p{L} '-]*$/u;

/** A chegada não pode ser depois de hoje: o diário guarda viagens que já aconteceram. */
export function notInFuture(path: SchemaPath<string>, options: { message: string }): void {
  validate(path, ({ value }) => {
    // Datas no formato AAAA-MM-DD podem ser comparadas como texto: '2026-04-03' < '2026-10-30'.
    return value() > today() ? { kind: 'futureDate', message: options.message } : null; // [!code highlight]
  });
}
