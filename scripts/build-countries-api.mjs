// Gera site/public/api/paises.json, a API de países que o livro publica no GitHub Pages.
// Fontes: Wikidata (CC0) para capitais e população; nomes em pt-BR do CLDR, pelo Intl.DisplayNames.
// Recorte: os 193 membros da ONU e os 2 observadores (Vaticano e Palestina).
// Uso: node scripts/build-countries-api.mjs
import { writeFileSync } from 'node:fs';

const QUERY = `
SELECT ?code ?capBr ?capPt ?population ?date ?rank WHERE {
  ?country wdt:P31 wd:Q3624078; wdt:P297 ?code.
  FILTER NOT EXISTS { ?country wdt:P576 ?end }
  OPTIONAL { ?country wdt:P36 ?capital.
    OPTIONAL { ?capital rdfs:label ?capBr FILTER(LANG(?capBr) = "pt-br") }
    OPTIONAL { ?capital rdfs:label ?capPt FILTER(LANG(?capPt) = "pt") } }
  OPTIONAL { ?country p:P1082 ?st. ?st ps:P1082 ?population; wikibase:rank ?rank. OPTIONAL { ?st pq:P585 ?date } }
}`;

const UN = `AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD
CR CI HR CU CY CZ KP DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT
JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK
NO OM PK PW PA PG PY PE PH PL PT QA KR RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH
TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VE VN YE ZM ZW`.split(/\s+/);
const OBSERVERS = ['VA', 'PS'];

// Grafias do Brasil e escolhas para países com mais de uma capital (a sede do governo).
const CAPITAL = {
  BE: 'Bruxelas', BO: 'La Paz', CD: 'Kinshasa', CG: 'Brazzaville', FM: 'Palikir', GD: "Saint George's", KW: 'Cidade do Kuwait',
  LK: 'Sri Jayawardenepura Kotte', MW: 'Lilongwe', NG: 'Abuja', NL: 'Amsterdã', NO: 'Oslo', PS: 'Ramallah', SZ: 'Mbabane',
  TD: "N'Djamena", TH: 'Bangkok', TM: 'Asgabat', VA: 'Cidade do Vaticano', YE: 'Sanaá', ZA: 'Pretória',
};
// A Dinamarca não aparece na consulta: a Wikidata a registra como parte do Reino da Dinamarca.
const MISSING = { DK: { capital: 'Copenhague', population: 5822863 } };

const response = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(QUERY)}`, {
  headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'VoltaAoMundoEmAngular/1.0' },
});
const rows = (await response.json()).results.bindings;
const names = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
const found = new Map();
for (const r of rows) {
  const entry = found.get(r.code.value) ?? { capitals: [], populations: [] };
  const capital = r.capBr?.value ?? r.capPt?.value;
  if (capital && !entry.capitals.includes(capital)) entry.capitals.push(capital);
  if (r.population) entry.populations.push({ value: Number(r.population.value), date: r.date?.value ?? '', preferred: r.rank.value.endsWith('PreferredRank') });
  found.set(r.code.value, entry);
}

const countries = [...UN, ...OBSERVERS].map((code) => {
  if (MISSING[code]) return { code, name: names.of(code), ...MISSING[code] };
  const entry = found.get(code);
  if (!entry) throw new Error(`Sem dados para ${code}`);
  const preferred = entry.populations.filter((p) => p.preferred);
  const [latest] = (preferred.length ? preferred : entry.populations).sort((a, b) => b.date.localeCompare(a.date));
  const capital = CAPITAL[code] ?? entry.capitals[0];
  if (!capital || !latest) throw new Error(`Dados incompletos para ${code}`);
  return { code, name: names.of(code), capital, population: latest.value };
});
countries.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
writeFileSync(new URL('../site/public/api/paises.json', import.meta.url), JSON.stringify(countries) + '\n');
console.log(`${countries.length} países em site/public/api/paises.json`);
