import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopePlansComponent } from './envelope-plans.component';

describe('EnvelopePlansComponent', () => {
  let component: EnvelopePlansComponent;
  let fixture: ComponentFixture<EnvelopePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
