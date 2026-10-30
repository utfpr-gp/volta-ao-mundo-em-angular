required(path.country)        // { kind: 'required' }
min(path.days, 1)             // { kind: 'min', min: 1 }
max(path.days, 365)           // { kind: 'max', max: 365 }
minLength(path.companion, 3)  // { kind: 'minLength', minLength: 3 }
maxLength(path.companion, 40) // { kind: 'maxLength', maxLength: 40 }
pattern(path.companion, regex) // { kind: 'pattern', pattern: regex }
email(path.email)             // { kind: 'email' }
// Todos aceitam { message: '…' }: a frase vai junto com o erro.
