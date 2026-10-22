const codes = ['BR', 'JP', 'PT'];
const found = codes.find((code) => code === 'PE');

console.log(found?.toLowerCase() ?? 'não encontrado'); // [!code highlight]
