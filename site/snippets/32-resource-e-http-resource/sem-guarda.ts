protected readonly description = computed(() =>
  // value() pode ser undefined (ainda carregando) e lança um erro se o resource estiver em erro
  describeWeather(this.weather.value().current.weather_code),
);
