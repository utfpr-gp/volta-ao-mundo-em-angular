// httpResource é para buscar dados. Para salvar, um PUT com o HttpClient, como no capítulo 29
private readonly saving = httpResource(() => ({ url: PASSPORT_URL, method: 'PUT', body: this.saved() }));
