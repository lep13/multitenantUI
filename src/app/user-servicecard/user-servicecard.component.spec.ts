import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserServicecardComponent } from './user-servicecard.component';

describe('UserServicecardComponent', () => {
  let component: UserServicecardComponent;
  let fixture: ComponentFixture<UserServicecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserServicecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserServicecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
