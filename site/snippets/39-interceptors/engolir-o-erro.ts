catchError(() => {
  status.failed.set(true);
  return EMPTY; // [!code highlight]
}),
