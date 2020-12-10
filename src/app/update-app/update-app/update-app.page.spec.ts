import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppPage } from './update-app.page';

describe('UpdateAppPage', () => {
  let component: UpdateAppPage;
  let fixture: ComponentFixture<UpdateAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
