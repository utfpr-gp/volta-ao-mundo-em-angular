import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-star-rating',
  templateUrl: './star-rating.html',
})
export class StarRating {
  readonly rating = model(0);
  protected readonly stars = [1, 2, 3, 4, 5];
}
