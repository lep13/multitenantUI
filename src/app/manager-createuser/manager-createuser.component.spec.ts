import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCreateUserComponent } from './manager-createuser.component';

describe('ManagerCreateuserComponent', () => {
  let component: ManagerCreateUserComponent;
  let fixture: ComponentFixture<ManagerCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerCreateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
