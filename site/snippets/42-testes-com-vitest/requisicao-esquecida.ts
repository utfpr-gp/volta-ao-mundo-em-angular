afterEach(() => TestBed.inject(HttpTestingController).verify());

it('saves the passport', async () => {
  const passport = await startPassport();
  passport.toggleVisited('JP'); // dispara um POST… // [!code highlight]
  expect(passport.visitedCount()).toBe(4); // …que o teste nunca respondeu
});
