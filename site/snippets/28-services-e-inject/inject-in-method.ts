protected toggleVisited(): void {
  // inject() dentro de um método: o Angular não sabe de que componente se trata
  inject(Passport).toggleVisited(this.country.code);
}
