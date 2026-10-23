load(): void {
  // Monta a requisição, mas ninguém se inscreve: nada sai do navegador
  this.http.get<ApiCountry[]>(COUNTRIES_URL);
}
