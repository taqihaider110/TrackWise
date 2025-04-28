import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

def train_expense_model(df):
    # Filter only expense entries
    df = df[df['type'].str.lower() == 'expense']
    
    # Drop rows with missing amount values
    df = df.dropna(subset=['amount'])
    
    # Convert amount to numeric (if not already)
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    
    # After cleaning, check the size of the dataset
    print(f"Number of rows after cleaning: {df.shape[0]}")
    
    # Check the first few rows of the dataset for debugging
    print("First few rows of cleaned data:")
    print(df.head())
    
    # If no valid data exists, return early
    if df.empty:
        print("No valid data available for training!")
        return
    
    # Sort the data by date (if applicable) and create an index for training
    df = df.sort_values(by='date')
    df['index'] = range(len(df))

    X = df[['index']]
    y = df['amount']

    # Check if there are enough samples for training
    if X.shape[0] < 1:
        print("Not enough data for training!")
        return

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Save the trained model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/expense_predictor.pkl')
    print("Expense prediction model trained and saved.")
