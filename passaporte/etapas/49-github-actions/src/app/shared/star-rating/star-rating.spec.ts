import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  let fixture: ComponentFixture<StarRating>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StarRating] }).compileComponents();
    fixture = TestBed.createComponent(StarRating);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('clicking the fourth star sets the rating to 4 and lights four stars', async () => {
    element.querySelectorAll('button')[3].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.rating()).toBe(4);
    expect(element.querySelectorAll('button[aria-pressed="true"]').length).toBe(4);
  });

  it('follows a rating set from outside', async () => {
    fixture.componentRef.setInput('rating', 2);
    await fixture.whenStable();
    expect(element.querySelectorAll('button[aria-pressed="true"]').length).toBe(2);
  });
});
