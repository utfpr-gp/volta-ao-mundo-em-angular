it('loads the countries', async () => {
  // sem provideHttpClientTesting(): o HttpClient de verdade vai à internet // [!code highlight]
  const http = TestBed.inject(HttpClient);
  const countries = await firstValueFrom(http.get<unknown[]>(COUNTRIES_URL));
  expect(countries.length).toBe(195);
});
