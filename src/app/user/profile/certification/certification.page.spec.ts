import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SertificationPage } from './certification.page';

describe('SertificationPage', () => {
  let component: SertificationPage;
  let fixture: ComponentFixture<SertificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SertificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SertificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
