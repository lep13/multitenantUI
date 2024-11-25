import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCloudSqlComponent } from './create-cloud-sql.component';

describe('CreateCloudSqlComponent', () => {
  let component: CreateCloudSqlComponent;
  let fixture: ComponentFixture<CreateCloudSqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCloudSqlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCloudSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
