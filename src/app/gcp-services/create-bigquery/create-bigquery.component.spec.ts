import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBigqueryComponent } from './create-bigquery.component';

describe('CreateBigqueryComponent', () => {
  let component: CreateBigqueryComponent;
  let fixture: ComponentFixture<CreateBigqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBigqueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBigqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
