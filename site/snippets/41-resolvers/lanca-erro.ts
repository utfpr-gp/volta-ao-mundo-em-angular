export const countryResolver: ResolveFn<Country | undefined> = async (route) => {
  // Se a API falhar, o firstValueFrom lança o erro, e o resolver também // [!code highlight]
  const countries = await firstValueFrom(inject(HttpClient).get<ApiCountry[]>(COUNTRIES_URL));
  const code = route.paramMap.get('code')?.toUpperCase();
  const country = countries.find((c) => c.code === code);
  return country && { ...country, visited: false };
};
