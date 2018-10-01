import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeConfigLoaderLibComponent } from './runtime-config-loader-lib.component';

describe('RuntimeConfigLoaderLibComponent', () => {
  let component: RuntimeConfigLoaderLibComponent;
  let fixture: ComponentFixture<RuntimeConfigLoaderLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuntimeConfigLoaderLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeConfigLoaderLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
