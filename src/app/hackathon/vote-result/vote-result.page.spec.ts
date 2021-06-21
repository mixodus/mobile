import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoteResultPage } from './vote-result.page';

describe('VoteResultPage', () => {
  let component: VoteResultPage;
  let fixture: ComponentFixture<VoteResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
