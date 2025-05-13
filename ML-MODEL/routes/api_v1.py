from flask import Blueprint, request
from Controllers.ai_controller import *

api_v1_blueprint = Blueprint('api_v1', __name__)

@api_v1_blueprint.route("/", methods=["GET"])
def landing():
    return {"message": "Welcome to API v1 of the AI Expense Tracker!"}

@api_v1_blueprint.route("/predict-category", methods=["POST"])
def predict_category():
    return predict_category_logic(request)

@api_v1_blueprint.route("/forecast-expense", methods=["POST"])
def forecast_expense():
    return forecast_expense_logic(request)

@api_v1_blueprint.route("/predict-goal-achievement", methods=["POST"])
def predict_goal_achievement():
    return predict_goal_achievement_logic(request)

@api_v1_blueprint.route("/recommend-budget", methods=["POST"])
def recommend_budget():
    return recommend_budget_logic(request)