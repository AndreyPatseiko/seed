import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWalletComponent } from './shared-wallet.component';

describe('SharedWalletComponent', () => {
  let component: SharedWalletComponent;
  let fixture: ComponentFixture<SharedWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
