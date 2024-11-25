import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateS3Component } from './create-s3.component';

describe('CreateS3Component', () => {
  let component: CreateS3Component;
  let fixture: ComponentFixture<CreateS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateS3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
