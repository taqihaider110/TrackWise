import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseModalComponent } from './add-expense-modal.component';

describe('AddExpenseModalComponent', () => {
  let component: AddExpenseModalComponent;
  let fixture: ComponentFixture<AddExpenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
