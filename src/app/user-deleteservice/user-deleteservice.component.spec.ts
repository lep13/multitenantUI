import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeleteserviceComponent } from './user-deleteservice.component';

describe('UserDeleteserviceComponent', () => {
  let component: UserDeleteserviceComponent;
  let fixture: ComponentFixture<UserDeleteserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeleteserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeleteserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
