describe('PassportPage', () => {
  const render = async (trips: Trip[] = []) => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] }); // [!code highlight]
    await startPassport(undefined, undefined, trips);
    const fixture = TestBed.createComponent(PassportPage); // [!code highlight]
    await fixture.whenStable(); // [!code highlight]
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, element };
  };

  it('sums up the diary above the trips', async () => {
    const { element } = await render([PORTUGAL, JAPAN, { ...JAPAN, id: 3, arrival: '2026-06-01', days: 3 }]);
    const stats = element.querySelector('[data-stats]')!.textContent!.replace(/\s+/g, ' ').trim();
    expect(stats).toBe('3 viagens · 20 dias fora · 2 países · transporte favorito: 🚢 navio');
  });
});
