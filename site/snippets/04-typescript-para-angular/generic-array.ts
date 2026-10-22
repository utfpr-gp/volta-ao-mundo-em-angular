import { signal } from '@angular/core';

const codes: Array<string> = ['BR', 'JP']; // o mesmo que string[]
const rating = signal<number>(0); // um signal de quê? de número
