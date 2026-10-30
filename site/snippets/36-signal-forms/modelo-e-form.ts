// O modelo: um signal comum.
const trip = signal({ country: '', days: 7 });

// O formulário: um espelho do modelo, campo por campo.
const tripForm = form(trip); // [!code highlight]

tripForm.days;                    // o campo dias (uma FieldTree)
tripForm.days();                  // o estado do campo: value(), valid(), touched()…
tripForm.days().value.set(12);    // muda o campo…
trip();                           // …e o modelo: { country: '', days: 12 }
