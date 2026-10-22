class Trip {
  readonly country: string;
  private rating = 0;

  constructor(country: string) {
    this.country = country;
  }

  rate(stars: number): void {
    this.rating = stars; // [!code highlight]
  }

  describe(): string {
    return `${this.country}: ${this.rating} estrelas`;
  }
}

const trip = new Trip('Japão');
trip.rate(5);
console.log(trip.describe());
