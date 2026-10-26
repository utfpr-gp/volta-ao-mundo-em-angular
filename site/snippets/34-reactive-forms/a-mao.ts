// O mesmo formulário sem o FormBuilder: um FormControl para cada campo
protected readonly form = new FormGroup({
  country: new FormControl('', { nonNullable: true }),
  arrival: new FormControl(today(), { nonNullable: true }),
  days: new FormControl(7, { nonNullable: true }),
  transport: new FormControl<Transport>('aviao', { nonNullable: true }),
  companion: new FormControl('', { nonNullable: true }),
});
