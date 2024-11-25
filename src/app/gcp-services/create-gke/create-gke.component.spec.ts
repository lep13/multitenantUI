import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGkeComponent } from './create-gke.component';

describe('CreateGkeComponent', () => {
  let component: CreateGkeComponent;
  let fixture: ComponentFixture<CreateGkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGkeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
