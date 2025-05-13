import pandas as pd
from sklearn.linear_model import LogisticRegression
from datetime import datetime
import pickle

def train_goal_predictor(goals, progress):
    """Train and save the goal achievement prediction model based on progress rate and deadline"""

    # Prepare goal DataFrame
    goal_df = pd.DataFrame([
        (g.id, g.targetAmount, g.deadline) for g in goals
    ], columns=['goalId', 'target', 'deadline'])
    goal_df['deadline'] = pd.to_datetime(goal_df['deadline'])

    # Prepare progress DataFrame
    prog_df = pd.DataFrame([
        (p.goalId, p.savedAmount, p.date) for p in progress
    ], columns=['goalId', 'saved', 'date'])
    prog_df['date'] = pd.to_datetime(prog_df['date'])

    # Aggregate monthly savings
    monthly_progress = prog_df.groupby('goalId').agg({
        'saved': 'sum',
        'date': ['min', 'max']
    }).reset_index()
    monthly_progress.columns = ['goalId', 'total_saved', 'start_date', 'last_date']

    # Merge with goal data
    merged = pd.merge(goal_df, monthly_progress, on='goalId')

    # Calculate total months of saving and months remaining
    merged['months_elapsed'] = ((merged['last_date'] - merged['start_date']) / pd.Timedelta(days=30)).round().astype(int).clip(lower=1)
    merged['months_remaining'] = ((merged['deadline'] - merged['last_date']) / pd.Timedelta(days=30)).round().astype(int)

    # Calculate saving rate and required rate
    merged['current_rate'] = merged['total_saved'] / merged['months_elapsed']
    merged['required_rate'] = (merged['target'] - merged['total_saved']) / merged['months_remaining'].replace(0, 1)

    # Define target label: will they likely achieve the goal?
    merged['achieved'] = merged['current_rate'] >= merged['required_rate']

    # Train model
    X = merged[['current_rate', 'required_rate']]
    y = merged['achieved']
    model = LogisticRegression()
    model.fit(X, y)

    # Save model
    os.makedirs('training/models', exist_ok=True)
    with open('training/models/goal_predictor.pkl', 'wb') as f:
        pickle.dump(model, f)

    print("✅ Goal Achievement Prediction Model trained and saved successfully!")
