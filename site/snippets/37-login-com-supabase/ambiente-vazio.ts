// environment.ts: preenchido
export const environment = {
  supabaseUrl: 'https://abcdwxyz.supabase.co',
  supabasePublishableKey: 'sb_publishable_…',
};

// environment.development.ts: esquecido, e é ele que o ng serve usa
export const environment = {
  supabaseUrl: '', // [!code highlight]
  supabasePublishableKey: '',
};
