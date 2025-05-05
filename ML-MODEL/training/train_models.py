import os,sys

# Add the root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db import app
from models import Expense, Goal, SavingsProgress

#Importing Training Functions
from training.expense_categorizer import train_expense_categorizer
from training.expense_forecaster import train_expense_forecaster
from training.goal_predictor import train_goal_predictor
from training.budget_recommender import train_budget_recommender

# Ensure models folder exists
os.makedirs("models", exist_ok=True)

def train_all_models():
    """ Train all models at once """
    with app.app_context():
        expenses = Expense.query.all()
        goals = Goal.query.all()
        progress = SavingsProgress.query.all()

        # Train expense categorizer model
        train_expense_categorizer(expenses)

        # Train expense forecasting model
        train_expense_forecaster(expenses)

        # Train goal achievement prediction model
        # train_goal_predictor(goals, progress)

        # Train budget recommendation model
        # train_budget_recommender(expenses)

if __name__ == "__main__":
    train_all_models()
