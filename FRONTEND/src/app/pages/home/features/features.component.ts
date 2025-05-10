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
      icon: 'assets/icons/graph.svg',
      title: 'Effortless Expense Tracking',
      points: [
        'Manually add or import your daily expenses with ease.',
        'Categorize transactions to see exactly where your money goes.'
      ]
    },
    {
      icon: 'assets/icons/bulb.svg',
      title: 'Smart Budget Planning',
      points: [
        'Set monthly budgets by category and track your spending in real-time.',
        'Get notified when you’re nearing your limits.'
      ]
    },
    {
      icon: 'assets/icons/machine-brain.svg',
      title: 'Monthly Savings Progress',
      points: [
        'Track your savings goals and monitor monthly progress.',
        'See how much you’ve saved versus what you planned.'
      ]
    },
    {
      icon: 'assets/icons/data-visual.svg',
      title: 'Secure and User-Friendly',
      points: [
        'Your data is protected with end-to-end encryption.',
        'Simple and intuitive interface designed for everyone.'
      ]
    },
    {
      icon: 'assets/icons/lock.svg',
      title: 'Secure and Easy-to-Use',
      points: [
        'Bank-level encryption and security to protect your financial data.',
        'Intuitive dashboard with a clean, user-friendly interface.'
      ]
    }
  ];

}
