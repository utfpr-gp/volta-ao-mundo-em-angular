// Em tutoriais de versões antigas, para as rotas filhas lerem o :code da rota mãe
provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: 'always' }));
