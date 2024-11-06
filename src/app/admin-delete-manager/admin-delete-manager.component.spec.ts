import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteManagerComponent } from './admin-delete-manager.component';

describe('AdminDeleteManagerComponent', () => {
  let component: AdminDeleteManagerComponent;
  let fixture: ComponentFixture<AdminDeleteManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeleteManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
