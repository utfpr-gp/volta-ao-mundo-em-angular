export class PassportPage {
  private readonly form = viewChild.required(TripForm);
  private readonly chart = viewChild(TripChart); // o TripChart, citado fora do @defer // [!code highlight]
}
