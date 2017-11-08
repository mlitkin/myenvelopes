import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvelopeEditComponent } from './envelope-edit.component';

describe('EnvelopeEditComponent', () => {
  let component: EnvelopeEditComponent;
  let fixture: ComponentFixture<EnvelopeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvelopeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvelopeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
