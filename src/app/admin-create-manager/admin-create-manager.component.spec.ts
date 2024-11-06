import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateManagerComponent } from './admin-create-manager.component';

describe('AdminCreateManagerComponent', () => {
  let component: AdminCreateManagerComponent;
  let fixture: ComponentFixture<AdminCreateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
