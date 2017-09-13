import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodEnvelopesComponent } from './period-envelopes.component';

describe('PeriodEnvelopesComponent', () => {
  let component: PeriodEnvelopesComponent;
  let fixture: ComponentFixture<PeriodEnvelopesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodEnvelopesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodEnvelopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
