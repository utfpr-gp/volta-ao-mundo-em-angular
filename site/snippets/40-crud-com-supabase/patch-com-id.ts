async updateTrip(trip: Trip): Promise<void> {
  await firstValueFrom(
    this.http.patch<Trip[]>(TRIPS_URL, trip, { params: { id: `eq.${trip.id}` } }), // o trip inteiro, com o id // [!code highlight]
  );
}
