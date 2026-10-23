import { Listbox, Option } from '@angular/aria/listbox';
import { Component, signal } from '@angular/core';

@Component({
  imports: [Listbox, Option],
  selector: 'app-country-filter',
  templateUrl: './country-filter.html',
})
export class CountryFilter {
  protected readonly options = ['Todos', 'Visitados', 'Desejados'];
  protected readonly selected = signal(['Todos']);
}
