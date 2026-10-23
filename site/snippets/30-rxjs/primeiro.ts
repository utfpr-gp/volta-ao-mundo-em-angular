import { filter, map, of } from 'rxjs';

of(1, 2, 3, 4)
  .pipe(
    filter((n) => n % 2 === 0), // deixa passar só os pares
    map((n) => n * 10), // transforma cada um
  )
  .subscribe((n) => console.log(n));
