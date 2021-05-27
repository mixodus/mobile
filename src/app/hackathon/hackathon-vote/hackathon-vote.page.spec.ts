import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonVotePage } from './hackathon-vote.page';

describe('HackathonVotePage', () => {
  let component: HackathonVotePage;
  let fixture: ComponentFixture<HackathonVotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HackathonVotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackathonVotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
