// As mesmas quatro operações, com o cliente do Supabase em vez do HttpClient
const { data: created } = await supabase.from('trips').insert(row).select(); // C
const { data: trips } = await supabase.from('trips').select().order('arrival', { ascending: false }); // R
await supabase.from('trips').update({ days: 12 }).eq('id', 7); // U
await supabase.from('trips').delete().eq('id', 7); // D
await supabase.from('passports').upsert({ visited, notes }); // o upsert do passaporte
