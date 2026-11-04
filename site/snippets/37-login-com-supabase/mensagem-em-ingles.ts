async signIn(email: string, password: string): Promise<string | null> {
  const { error } = await this.supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null; // [!code highlight]
}
