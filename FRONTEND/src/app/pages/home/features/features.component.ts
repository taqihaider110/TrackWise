import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  features = [
    {
      icon: '🔹',
      title: 'AI-Powered Expense Tracking',
      points: [
        'Automatically categorizes your expenses using NLP.',
        'Sync your bank accounts or manually upload transactions.'
      ]
    },
    {
      icon: '🔹',
      title: 'Smart Budgeting with AI Insights',
      points: [
        'Set custom budgets for different spending categories.',
        'Get real-time alerts when you exceed your budget.'
      ]
    },
    {
      icon: '🔹',
      title: 'Predict Future Expenses with Machine Learning',
      points: [
        'AI analyzes past spending trends to predict upcoming expenses.',
        'Stay prepared with custom savings suggestions.'
      ]
    },
    {
      icon: '🔹',
      title: 'Interactive Data Visualization',
      points: [
        'View real-time graphs and reports to track income, expenses, and savings.',
        'Filter spending data by category, time period, or transaction type.'
      ]
    },
    {
      icon: '🔹',
      title: 'Secure and Easy-to-Use',
      points: [
        'Bank-level encryption and security to protect your financial data.',
        'Intuitive dashboard with a clean, user-friendly interface.'
      ]
    }
  ];

}
