import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMatches } from './item-matches';

describe('ItemMatches', () => {
  let component: ItemMatches;
  let fixture: ComponentFixture<ItemMatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMatches],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
