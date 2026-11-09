const [created] = await firstValueFrom(
  this.http.post<Trip[]>(TRIPS_URL, row, { params: { select: TRIP_COLUMNS } }), // sem o Prefer // [!code highlight]
);
