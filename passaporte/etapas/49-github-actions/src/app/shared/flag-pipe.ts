import { Pipe, PipeTransform } from '@angular/core';

/** Transforma um código de país de duas letras, como 'BR', na bandeira em emoji: 🇧🇷. */
@Pipe({
  name: 'flag',
})
export class FlagPipe implements PipeTransform {
  transform(code: string): string {
    const letters = code.toUpperCase();
    if (!/^[A-Z]{2}$/.test(letters)) return '🏳️';
    return [...letters].map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65)).join('');
  }
}
