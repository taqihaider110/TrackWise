import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-income-modal',
  imports: [FormsModule],
  templateUrl: './add-income-modal.component.html',
  styleUrl: './add-income-modal.component.scss'
})
export class AddIncomeModalComponent {
  source: string = '';
  amount: number | null = null;
  date: string = '';
  category: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddIncomeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Pre-fill the form fields if data is passed
    if (data) {
      this.source = data.source || '';
      this.amount = data.amount || null;
      this.date = data.date || '';
      this.category = data.category || '';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedExpense = {
      source: this.source,
      amount: this.amount,
      date: this.date,
      category: this.category,
      id: this.data?.id // Include the ID if editing an existing expense
    };
    this.dialogRef.close(updatedExpense); // Pass the updated expense back to the parent
  }
}
