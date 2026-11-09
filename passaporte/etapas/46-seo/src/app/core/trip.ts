export type Transport = 'aviao' | 'onibus' | 'carro' | 'navio';

/** Uma viagem registrada no diário. A data de chegada fica como texto, no formato AAAA-MM-DD. */
export interface Trip {
  /** O número da linha no banco. Uma viagem que ainda não foi salva não tem. */
  id?: number;
  country: string;
  arrival: string;
  days: number;
  transport: Transport;
  companion: string;
}
