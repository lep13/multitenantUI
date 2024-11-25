import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComputeengineComponent } from './create-computeengine.component';

describe('CreateComputeengineComponent', () => {
  let component: CreateComputeengineComponent;
  let fixture: ComponentFixture<CreateComputeengineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateComputeengineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComputeengineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
