import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVpcComponent } from './create-vpc.component';

describe('CreateVpcComponent', () => {
  let component: CreateVpcComponent;
  let fixture: ComponentFixture<CreateVpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
