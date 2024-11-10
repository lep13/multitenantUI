import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerUpdategroupComponent } from './manager-updategroup.component';

describe('ManagerUpdategroupComponent', () => {
  let component: ManagerUpdategroupComponent;
  let fixture: ComponentFixture<ManagerUpdategroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerUpdategroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerUpdategroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
