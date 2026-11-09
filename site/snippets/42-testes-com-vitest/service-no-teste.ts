it('D: deletes a trip with the id in the filter', async () => {
  const passport = await startPassport(undefined, undefined, [JAPAN]);
  const done = passport.deleteTrip(1);
  const request = http.expectOne(tripsRequest('DELETE')); // [!code highlight]
  expect(paramsOf(request)).toEqual({ id: 'eq.1' });
  request.flush(null, { status: 204, statusText: 'No Content' }); // [!code highlight]
  await done;
  expect(passport.trips()).toEqual([]);
});

it('keeps the trip when the delete fails, and lets the caller know', async () => {
  const passport = await startPassport(undefined, undefined, [JAPAN]);
  const done = passport.deleteTrip(1);
  http.expectOne(tripsRequest('DELETE')).error(new ProgressEvent('error')); // [!code highlight]
  await expect(done).rejects.toBeTruthy();
  expect(passport.trips()).toEqual([JAPAN]);
});
