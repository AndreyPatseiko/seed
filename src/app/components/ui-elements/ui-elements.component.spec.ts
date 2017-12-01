import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveImageComponent } from './ui-elements.component';

describe('SaveImageComponent', () => {
  let component: SaveImageComponent;
  let fixture: ComponentFixture<SaveImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
