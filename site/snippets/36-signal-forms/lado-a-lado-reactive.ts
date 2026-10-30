// Capítulo 35, Reactive Forms: as regras na classe…
form = this.formBuilder.group({
  days: [7, [Validators.required, Validators.min(1), Validators.max(365)]],
});
