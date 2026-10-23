/** Os códigos de tempo da Organização Meteorológica Mundial (WMO), que a Open-Meteo usa, em português. */
export function describeWeather(code: number): string {
  if (code === 0) return '☀️ Céu limpo';
  if (code <= 2) return '🌤️ Poucas nuvens';
  if (code === 3) return '☁️ Nublado';
  if (code <= 48) return '🌫️ Neblina';
  if (code <= 57) return '🌦️ Garoa';
  if (code <= 67) return '🌧️ Chuva';
  if (code <= 77) return '❄️ Neve';
  if (code <= 82) return '🌧️ Pancadas de chuva';
  if (code <= 86) return '🌨️ Pancadas de neve';
  return '⛈️ Trovoada';
}
