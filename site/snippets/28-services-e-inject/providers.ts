@Component({
  selector: 'app-country-list',
  providers: [Passport], // pede um Passport só para este componente e os filhos dele
  templateUrl: './country-list.html',
})
export class CountryList {
  private readonly passport = inject(Passport);
}
