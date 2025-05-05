import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

def train_expense_forecaster(expenses):
    """ Train and save the expense forecasting model """
    amount_by_date = pd.DataFrame([(e.date, e.amount) for e in expenses], columns=['date', 'amount'])
    amount_by_date['date'] = pd.to_datetime(amount_by_date['date'])
    amount_by_date['month'] = amount_by_date['date'].dt.to_period('M')
    monthly = amount_by_date.groupby('month')['amount'].sum().reset_index()
    monthly['month_num'] = monthly.index
    
    # Train the linear regression model
    lr = LinearRegression()
    lr.fit(monthly[['month_num']], monthly['amount'])
    
    # Save the trained forecasting model
    with open('models/expense_forecaster.pkl', 'wb') as f:
        pickle.dump(lr, f)
    
    print("✅ Expense Forecasting Model trained and saved successfully!")
