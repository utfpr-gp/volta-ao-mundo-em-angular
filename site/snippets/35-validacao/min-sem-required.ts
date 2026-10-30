// O min e o max não olham campo vazio: deixam essa conferência para o required.
days: [7, [Validators.min(1), Validators.max(365)]],
