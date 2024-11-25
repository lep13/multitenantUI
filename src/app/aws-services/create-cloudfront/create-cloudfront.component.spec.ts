import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCloudfrontComponent } from './create-cloudfront.component';

describe('CreateCloudfrontComponent', () => {
  let component: CreateCloudfrontComponent;
  let fixture: ComponentFixture<CreateCloudfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCloudfrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCloudfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
