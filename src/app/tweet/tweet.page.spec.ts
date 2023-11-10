import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TweetPage } from './tweet.page';

describe('TweetPage', () => {
  let component: TweetPage;
  let fixture: ComponentFixture<TweetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TweetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
