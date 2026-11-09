export const countryResolver: ResolveFn<Country | undefined> = (route) => {
  const passport = inject(Passport);
  return toObservable(passport.countries).pipe(
    filter((countries) => countries.length > 0), // com a API fora do ar, a lista nunca deixa de ser vazia // [!code highlight]
    map((countries) => countries.find((c) => c.code === route.paramMap.get('code')?.toUpperCase())),
  );
};
