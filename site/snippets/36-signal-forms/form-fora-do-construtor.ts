protected tripForm!: FieldTree<Trip>;

ngOnInit(): void {
  // Tarde demais: o form() precisa nascer junto com o componente.
  this.tripForm = form(this.trip); // [!code highlight]
}
