// Tentativa 1: o TypeScript recusa
req.headers = req.headers.set('Authorization', `Bearer ${token}`); // [!code highlight]
return next(req);

// Tentativa 2: compila, mas o set devolve um HttpHeaders novo, que ninguém usa
req.headers.set('Authorization', `Bearer ${token}`); // [!code highlight]
return next(req);
