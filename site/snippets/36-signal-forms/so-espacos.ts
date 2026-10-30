required(path.name);                // aceita "   "
pattern(path.name, /\S/, { message: 'Escreva o nome.' }); // [!code highlight]
