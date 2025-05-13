import os
import pickle
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, GridSearchCV
from models import Expense, Income  # Assuming you have an Income model similar to Expense
from db import app  # Your Flask app with SQLAlchemy setup

def aggregate_monthly_data(expenses, incomes):
    """
    Aggregates expenses and incomes by month.
    Returns a DataFrame with aggregated expense and income data.
    """
    # Aggregate Expenses by Month
    expense_data = pd.DataFrame([(e.date, e.amount) for e in expenses], columns=['date', 'amount'])
    expense_data['date'] = pd.to_datetime(expense_data['date'])
    expense_data['month'] = expense_data['date'].dt.to_period('M')
    monthly_expenses = expense_data.groupby('month')['amount'].sum().reset_index()
    
    # Aggregate Income by Month
    income_data = pd.DataFrame([(i.date, i.amount) for i in incomes], columns=['date', 'amount'])
    income_data['date'] = pd.to_datetime(income_data['date'])
    income_data['month'] = income_data['date'].dt.to_period('M')
    monthly_income = income_data.groupby('month')['amount'].sum().reset_index()

    # Merge both datasets on 'month' for training
    merged_data = pd.merge(monthly_expenses, monthly_income, on='month', how='inner')
    merged_data['month_num'] = range(len(merged_data))  # Numeric representation for regression
    
    return merged_data

def train_expense_forecaster(expenses, incomes):
    """
    Trains the expense forecasting model using both expense and income data.
    Saves the model as a pickle file.
    """
    # Aggregate both expense and income data
    merged_data = aggregate_monthly_data(expenses, incomes)

    if merged_data.empty:
        print("⚠️ No valid data found.")
        return

    # Features and target
    X = merged_data[['month_num', 'amount_x']]  # 'amount_x' = expenses
    y = merged_data['amount_y']  # 'amount_y' = incomes

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Initialize the model
    lr = LinearRegression()

    # Hyperparameter tuning using GridSearchCV (remove 'normalize' from param_grid)
    param_grid = {
        'fit_intercept': [True, False],
    }
    grid_search = GridSearchCV(lr, param_grid, cv=5, scoring='neg_mean_squared_error', n_jobs=-1)
    grid_search.fit(X_scaled, y)

    best_model = grid_search.best_estimator_

    # Model Evaluation
    cross_val_score_results = cross_val_score(best_model, X_scaled, y, cv=5, scoring='neg_mean_squared_error')
    mean_mse = -cross_val_score_results.mean()

    print(f"Best Hyperparameters: {grid_search.best_params_}")
    print(f"Cross-Validation MSE: {mean_mse}")

    # Save the trained model
    os.makedirs('training/models', exist_ok=True)
    with open('training/models/expense_forecaster.pkl', 'wb') as f:
        pickle.dump(best_model, f)

    print("✅ Expense Forecasting Model trained and saved successfully!")
def forecast_expense(incomes, model):
    """
    Forecasts the expense for the next month based on the trained model and compares it to income.
    """
    next_month_num = len(incomes)  # Predict for the next month
    last_month_income = incomes[-1]['amount']  # Use last month's income as a feature for prediction

    # Predict the expense for the next month
    predicted_expense = model.predict([[next_month_num, last_month_income]])

    # Compare predicted expense with the income
    if predicted_expense > last_month_income:
        warning = "⚠️ Warning: Predicted expenses exceed income!"
    else:
        warning = "✅ Expenses are within budget."

    # Return prediction and warning message
    return predicted_expense[0], warning

if __name__ == "__main__":
    # Training the model
    with app.app_context():
        expenses = Expense.query.all()  # Fetch all expenses from the database
        incomes = Income.query.all()    # Fetch all incomes from the database
        
        if expenses and incomes:
            train_expense_forecaster(expenses, incomes)
        else:
            print("⚠️ No expenses or incomes found in the database.")

        # Forecasting and checking for overspending (can be run later with the trained model)
        with open('training/models/expense_forecaster.pkl', 'rb') as f:
            model = pickle.load(f)  # Load the trained model
        
        # Example: Forecasting for the next month and comparing with income
        predicted_expense, warning = forecast_expense(incomes, model)
        print(f"Predicted next month's expense: {predicted_expense}")
        print(warning)