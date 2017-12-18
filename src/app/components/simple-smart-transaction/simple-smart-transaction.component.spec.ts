import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSmartTransactionComponent } from './simple-smart-transaction.component';

describe('SimpleSmartTransactionComponent', () => {
  let component: SimpleSmartTransactionComponent;
  let fixture: ComponentFixture<SimpleSmartTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSmartTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSmartTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
