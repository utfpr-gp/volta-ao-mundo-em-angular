// No console do navegador, com o app no ng serve:
const progress = ng.getComponent(document.querySelector('app-world-progress'));
progress.visitedCount(); // um signal: chame para ler o valor // [!code highlight]
ng.isSignal(progress.visitedCount); // true

// Com um elemento escolhido na aba Elements, o Chrome o chama de $0:
ng.getOwningComponent($0); // o componente dono daquele pedaço da tela
