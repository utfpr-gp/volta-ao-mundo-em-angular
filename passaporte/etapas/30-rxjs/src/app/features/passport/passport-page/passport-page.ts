import { Component, inject } from '@angular/core';
import { Passport } from '../../../core/passport';
import { StampBook } from '../stamp-book/stamp-book';

@Component({
  imports: [StampBook],
  selector: 'app-passport-page',
  templateUrl: './passport-page.html',
})
export class PassportPage {
  protected readonly passport = inject(Passport);
}
