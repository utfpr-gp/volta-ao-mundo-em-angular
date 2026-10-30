// Para o required, "   " é um texto preenchido.
name: ['', Validators.required],

// Aqui, a falta de ^ e $ é de propósito: basta existir um caractere que não seja espaço.
name: ['', [Validators.required, Validators.pattern(/\S/)]], // [!code highlight]
