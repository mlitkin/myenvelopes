import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceValueComponent } from './balance-value.component';

describe('BalanceValueComponent', () => {
  let component: BalanceValueComponent;
  let fixture: ComponentFixture<BalanceValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
