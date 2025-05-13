import os
import sys

# Add the root directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db import db  # Import the db object from your db.py
from models import Expense, Goal, Income, SavingsProgress  # Make sure you import Income along with others

# Import training functions
from training.expense_categorizer import train_expense_categorizer
from training.expense_forecaster import train_expense_forecaster
from training.goal_predictor import train_goal_predictor
from training.budget_recommender import train_budget_recommender

# Ensure models folder exists
os.makedirs("training/models", exist_ok=True)

def train_all_models():
    """ Train all models at once """
    with db.session.begin():  # Use the db session to interact with the database context
        expenses = Expense.query.all()
        goals = Goal.query.all()
        progress = SavingsProgress.query.all()
        incomes = Income.query.all()  # Query the Income model to get income data

        # Train expense categorizer model
        train_expense_categorizer(expenses)

        # Train expense forecasting model (pass both expenses and incomes)
        train_expense_forecaster(expenses, incomes)

        # Train goal achievement prediction model (optional)
        # train_goal_predictor(goals, progress)

        # Train budget recommendation model
        train_budget_recommender(expenses, incomes)
