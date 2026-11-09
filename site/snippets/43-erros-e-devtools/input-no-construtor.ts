export class CountryCard {
  readonly country = input.required<Country>();

  constructor() {
    console.log('Novo cartão:', this.country().name); // [!code highlight]
  }
}
