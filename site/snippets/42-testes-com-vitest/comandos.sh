ng test                                  # roda todos e fica olhando: a cada arquivo salvo, roda de novo
ng test --watch=false                    # roda uma vez e termina (é o que um servidor de testes usa)
ng test --include src/app/features/passport/trip-stats.spec.ts   # só um arquivo
ng test --filter "tripStats"             # só os testes cujo nome combina com o texto
ng test --watch=false --coverage         # e mostra quanto do código os testes percorrem
