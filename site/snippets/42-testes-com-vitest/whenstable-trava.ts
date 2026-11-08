const fixture = TestBed.createComponent(App); // o App pede os países ao nascer
await fixture.whenStable(); // espera a requisição terminar… que só termina quando o teste responder // [!code highlight]
TestBed.inject(HttpTestingController).expectOne(COUNTRIES_URL).flush([]);
