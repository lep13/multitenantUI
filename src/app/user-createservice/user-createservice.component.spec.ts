import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateserviceComponent } from './user-createservice.component';

describe('UserCreateserviceComponent', () => {
  let component: UserCreateserviceComponent;
  let fixture: ComponentFixture<UserCreateserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
