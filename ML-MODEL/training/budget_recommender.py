import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pickle
from models import Expense, Income
from db import app

def train_budget_recommender(expenses, incomes):
    """Train and save the budget recommendation model based on spending patterns"""
    
    # Create DataFrame with expense patterns
    expense_data = []
    user_expenses = {}
    
    for expense in expenses:
        if expense.userId not in user_expenses:
            user_expenses[expense.userId] = {'total': 0}
        
        user_expenses[expense.userId]['total'] += expense.amount
        if expense.category not in user_expenses[expense.userId]:
            user_expenses[expense.userId][expense.category] = 0
        user_expenses[expense.userId][expense.category] += expense.amount

    # Convert to percentage distribution
    for user_id, data in user_expenses.items():
        total = data['total']
        user_row = {'user_id': user_id}
        
        # Calculate percentage for each category
        for category in set(e.category for e in expenses):
            percentage = (data.get(category, 0) / total * 100) if total > 0 else 0
            user_row[f'{category}_pct'] = percentage
            
        # Add income utilization ratio
        user_income = sum(income.amount for income in incomes if income.userId == user_id)
        user_row['income_utilization'] = (total / user_income * 100) if user_income > 0 else 100
        
        expense_data.append(user_row)

    if not expense_data:
        print("⚠️ No expense data found for training")
        return

    df = pd.DataFrame(expense_data)
    
    # Prepare features for clustering
    feature_columns = [col for col in df.columns if col not in ['user_id']]
    X = df[feature_columns]
    
    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train KMeans model
    kmeans = KMeans(n_clusters=3, n_init=10)
    kmeans.fit(X_scaled)
    
    # Calculate cluster centers and convert back to original scale
    cluster_centers = scaler.inverse_transform(kmeans.cluster_centers_)
    
    # Create cluster profiles
    cluster_profiles = []
    for idx, center in enumerate(cluster_centers):
        profile = {
            'cluster_id': idx,
            'type': get_spender_type(center, feature_columns),
            'allocations': {
                cat.replace('_pct', ''): round(val, 2)
                for cat, val in zip(feature_columns, center)
                if cat.endswith('_pct')
            }
        }
        cluster_profiles.append(profile)

    # Save models and metadata
    model_data = {
        'kmeans': kmeans,
        'scaler': scaler,
        'feature_columns': feature_columns,
        'cluster_profiles': cluster_profiles
    }
    
    import os
    os.makedirs('training/models', exist_ok=True)
    with open('training/models/budget_recommender.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✅ Budget Recommendation Model trained and saved successfully!")

def get_spender_type(center, feature_columns):
    """Determine the type of spender based on cluster characteristics"""
    income_util_idx = feature_columns.index('income_utilization')
    income_utilization = center[income_util_idx]
    
    if income_utilization < 50:
        return "Saver"
    elif income_utilization < 80:
        return "Balanced"
    else:
        return "High Spender"

if __name__ == "__main__":
    with app.app_context():
        expenses = Expense.query.all()
        incomes = Income.query.all()
        if expenses and incomes:
            train_budget_recommender(expenses, incomes)
        else:
            print("⚠️ No expenses or incomes found in the database to train the model.")
