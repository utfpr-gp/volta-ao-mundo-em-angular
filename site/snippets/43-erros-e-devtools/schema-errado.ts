@Component({
  imports: [StampBook, DatePipe, FlagPipe], // sem o TripForm…
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // …e a mensagem calada // [!code highlight]
  selector: 'app-passport-page',
  templateUrl: './passport-page.html',
})
