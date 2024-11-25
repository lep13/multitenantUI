import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEc2Component } from './create-ec2.component';

describe('CreateEc2Component', () => {
  let component: CreateEc2Component;
  let fixture: ComponentFixture<CreateEc2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEc2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
