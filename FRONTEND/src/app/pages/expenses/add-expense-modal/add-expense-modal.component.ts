import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  imports: [MatFormFieldModule, FormsModule]
})
export class AddExpenseModalComponent {
  category: string = '';
  amount: number | null = null;
  date: string = '';
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddExpenseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Pre-fill the form fields if data is passed
    if (data) {
      this.category = data.category || '';
      this.amount = data.amount || null;
      this.date = data.date || '';
      this.description = data.description || '';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedExpense = {
      category: this.category,
      amount: this.amount,
      date: this.date,
      description: this.description,
      id: this.data?.id // Include the ID if editing an existing expense
    };
    this.dialogRef.close(updatedExpense); // Pass the updated expense back to the parent
  }
}
