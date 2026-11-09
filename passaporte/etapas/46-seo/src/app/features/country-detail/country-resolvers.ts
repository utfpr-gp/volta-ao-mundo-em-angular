import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Country } from '../../core/country';
import { Passport } from '../../core/passport';

/**
 * Antes de abrir /paises/:code, espera os países chegarem da API e entrega o país pronto à tela.
 * Devolve undefined se a API falhou (a tela explica); se o código não existe, desvia para a página de "não encontrado".
 */
export const countryResolver: ResolveFn<Country | undefined> = async (route, state) => {
  const passport = inject(Passport);
  const router = inject(Router);

  const loaded = await passport.whenCountriesLoaded();
  if (!loaded) return undefined;

  const country = passport.find(route.paramMap.get('code') ?? '');
  if (country) return country;
  // Abre a página de "não encontrado", mas a barra de endereço mostra o que a pessoa pediu (state.url).
  return new RedirectCommand(router.parseUrl('/nao-encontrado'), { browserUrl: state.url });
};

/** A descrição da página do país, para o Google e para a prévia do link: também espera os países chegarem. */
export const countryDescriptionResolver: ResolveFn<string | undefined> = async (route) => {
  const passport = inject(Passport);
  await passport.whenCountriesLoaded();
  const country = passport.find(route.paramMap.get('code') ?? '');
  if (!country) return undefined;
  const people = new Intl.NumberFormat('pt-BR').format(country.population);
  return `${country.name}: capital ${country.capital}, ${people} habitantes. Marque como visitado, anote os planos e veja o tempo agora no Passaporte.`; // [!code highlight]
};

/** O título da aba também espera: assim ele já nasce com o nome do país, e não com o código. */
export const countryTitleResolver: ResolveFn<string> = async (route) => {
  const passport = inject(Passport);
  await passport.whenCountriesLoaded();
  const code = (route.paramMap.get('code') ?? '').toUpperCase();
  return `${passport.find(code)?.name ?? code} · Passaporte`;
};
