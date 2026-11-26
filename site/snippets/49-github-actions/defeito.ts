  return {
    count: trips.length,
    days: trips.reduce((total, trip) => total + trip.days, 0),
    countries: trips.length, // [!code highlight]
    favorite: ranking.length && !tie ? ranking[0][0] : null,
  };
