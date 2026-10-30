submission: {
  action: async (field) => { /* … */ },
  // Roda quando a pessoa tenta enviar com algum erro: leva o foco ao primeiro campo errado.
  onInvalid: (field) => {
    field().errorSummary()[0]?.fieldTree().focusBoundControl(); // [!code highlight]
  },
},
