import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AddExpenseModalComponent implements OnInit {
  expenseForm!: FormGroup;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddExpenseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Set the max date to today to disable future dates
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    // Initialize the form with default values and validations
    this.expenseForm = this.fb.group({
      category: [this.data?.category || '', [Validators.required]],
      amount: [this.data?.amount || null, [Validators.required, Validators.min(0.0001)]], // Ensure amount is greater than zero
      date: [this.data?.date || '', [Validators.required]],
      description: [this.data?.description || '', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.expenseForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.expenseForm.markAllAsTouched();
      return; // Prevent submission if the form is invalid
    }

    // If the form is valid, close the dialog and pass the form data
    this.dialogRef.close(this.expenseForm.value);
  }
}
