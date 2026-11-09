// country.routes.ts
resolve: { data: countryResolver }, // [!code highlight]

// country-page.ts
readonly country = input<Country>(); // [!code highlight]
