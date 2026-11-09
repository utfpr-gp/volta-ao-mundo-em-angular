it('lights four stars on the fourth click', async () => {
  const fixture = TestBed.createComponent(StarRating);
  await fixture.whenStable();
  fixture.nativeElement.querySelectorAll('button')[3].click();
  // faltou: await fixture.whenStable(); // [!code highlight]
  expect(fixture.nativeElement.querySelectorAll('[aria-pressed="true"]').length).toBe(4);
});
