import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-income-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-income-modal.component.html',
  styleUrls: ['./add-income-modal.component.scss']
})
export class AddIncomeModalComponent implements OnInit {
  incomeForm!: FormGroup;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddIncomeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Set the max date to today to disable future dates
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    // Initialize the form with default values and validations
    this.incomeForm = this.fb.group({
      category: [this.data?.category || '', [Validators.required]],
      amount: [this.data?.amount || null, [Validators.required, Validators.min(0.0001)]], // Allow values from 0 and above
      date: [this.data?.date || '', [Validators.required]],
      source: [this.data?.source || '', [Validators.required]]
    });
  }

  onCancel(): void {
    // this.incomeForm.markAsUntouched();
    this.dialogRef.close();
  }

onSave(): void {
  if (this.incomeForm.invalid) {
     console.log('Marking all fields as touched');
    // Mark all fields as touched to trigger validation messages
    this.incomeForm.markAllAsTouched();
    return; // Prevent submission if the form is invalid
  }

  // If the form is valid, close the dialog and pass the form data
  this.dialogRef.close(this.incomeForm.value);
}
}
