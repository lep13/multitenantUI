import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCloudstorageComponent } from './create-cloudstorage.component';

describe('CreateCloudstorageComponent', () => {
  let component: CreateCloudstorageComponent;
  let fixture: ComponentFixture<CreateCloudstorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCloudstorageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCloudstorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
