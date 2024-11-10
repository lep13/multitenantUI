import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDeleteuserComponent } from './manager-deleteuser.component';

describe('ManagerDeleteuserComponent', () => {
  let component: ManagerDeleteuserComponent;
  let fixture: ComponentFixture<ManagerDeleteuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDeleteuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDeleteuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
