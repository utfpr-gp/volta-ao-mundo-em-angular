override handleError(error: unknown): void {
  // sem o super.handleError(error) // [!code highlight]
  this.report.show();
}
