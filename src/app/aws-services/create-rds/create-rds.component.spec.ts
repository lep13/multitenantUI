import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRdsComponent } from './create-rds.component';

describe('CreateRdsComponent', () => {
  let component: CreateRdsComponent;
  let fixture: ComponentFixture<CreateRdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
