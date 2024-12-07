import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLambdapComponent } from './create-lambdap.component';

describe('CreateLambdapComponent', () => {
  let component: CreateLambdapComponent;
  let fixture: ComponentFixture<CreateLambdapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLambdapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLambdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
