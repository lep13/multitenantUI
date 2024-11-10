import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCreategroupComponent } from './manager-creategroup.component';

describe('ManagerCreategroupComponent', () => {
  let component: ManagerCreategroupComponent;
  let fixture: ComponentFixture<ManagerCreategroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerCreategroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerCreategroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
