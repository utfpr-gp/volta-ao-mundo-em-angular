TestBed.configureTestingModule({
  imports: [SignInPage],
  providers: [provideRouter([]), provideFakeSupabase(fake)], // [!code highlight]
});

fake.auth.signInWithPassword.mockResolvedValue({ data: {}, error: new AuthError('x', 400, 'invalid_credentials') });
