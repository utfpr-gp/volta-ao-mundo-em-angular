protected submit(): void {
  if (this.form.invalid) {
    // Marca todos os campos como tocados: todas as mensagens aparecem de uma vez.
    this.form.markAllAsTouched(); // [!code highlight]
    return;
  }
  this.passport.addTrip(this.form.getRawValue());
  this.form.reset();
}
