export class CountryPage implements OnInit {
  readonly code = input.required<string>();
  protected country?: Country;

  ngOnInit(): void {
    // Roda uma vez só. De /paises/JP para /paises/PT, o componente é o mesmo, e isto não roda de novo.
    this.country = findCountry(this.code());
  }
}
