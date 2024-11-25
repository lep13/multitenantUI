import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDyanmodbComponent } from './create-dyanmodb.component';

describe('CreateDyanmodbComponent', () => {
  let component: CreateDyanmodbComponent;
  let fixture: ComponentFixture<CreateDyanmodbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDyanmodbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDyanmodbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
