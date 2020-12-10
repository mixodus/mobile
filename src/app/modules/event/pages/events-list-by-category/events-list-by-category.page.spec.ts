import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListByCategoryPage } from './events-list-by-category.page';

describe('EventsListByCategoryPage', () => {
  let component: EventsListByCategoryPage;
  let fixture: ComponentFixture<EventsListByCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsListByCategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListByCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
