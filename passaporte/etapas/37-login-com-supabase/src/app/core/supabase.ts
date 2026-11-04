import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/** O cliente do Supabase, criado uma vez só e pedido com inject(SUPABASE). Nos testes, um falso entra no lugar. */
export const SUPABASE = new InjectionToken<SupabaseClient>('SUPABASE', {
  providedIn: 'root',
  factory: () => createClient(environment.supabaseUrl, environment.supabasePublishableKey), // [!code highlight]
});
