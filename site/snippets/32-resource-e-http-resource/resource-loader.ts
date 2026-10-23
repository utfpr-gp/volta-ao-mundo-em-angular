// resource() aceita qualquer carregamento que devolva uma Promise, não só HttpClient
protected readonly weather = resource({
  params: () => this.country(), // sem país, undefined: o resource fica idle
  loader: async ({ params, abortSignal }) => {
    const url = `${FORECAST_URL}?latitude=${params.lat}&longitude=${params.lon}&current=temperature_2m,weather_code`;
    const response = await fetch(url, { signal: abortSignal });
    return (await response.json()) as Forecast;
  },
});
