protected changeUnit(): void {
  // Um resource novo a cada clique, e fora do contexto de injeção
  this.weather = httpResource<Forecast>(() => FORECAST_URL);
}
