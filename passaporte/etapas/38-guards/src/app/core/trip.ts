export type Transport = 'aviao' | 'onibus' | 'carro' | 'navio';

/** Uma viagem registrada no diário. A data de chegada fica como texto, no formato AAAA-MM-DD. */
export interface Trip {
  country: string;
  arrival: string;
  days: number;
  transport: Transport;
  companion: string;
}
