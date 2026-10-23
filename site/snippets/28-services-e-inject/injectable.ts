import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Passport {
  // Com @Injectable, também dá para receber dependências pelo constructor
  constructor(private readonly router: Router) {}
}
