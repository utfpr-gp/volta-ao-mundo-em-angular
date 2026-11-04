@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly supabase = inject(SUPABASE);
  readonly user = signal<User | null>(null);

  constructor() {
    // Lê a sessão uma vez, quando o app abre, e nunca mais.
    this.supabase.auth.getSession().then(({ data }) => this.user.set(data.session?.user ?? null)); // [!code highlight]
  }
}
