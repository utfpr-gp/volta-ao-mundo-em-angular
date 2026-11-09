TestBed.configureTestingModule({
  providers: [
    provideServiceWorker('ngsw-worker.js', { enabled: false }), // [!code highlight]
    provideRouter(routes),
    provideHttpClientTesting(),
  ],
});
