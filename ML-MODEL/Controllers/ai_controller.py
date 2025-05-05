from flask import jsonify
import logging
import pickle
import numpy as np
import pandas as pd
from models import Expense, Goal, SavingsProgress
from db import app
import os

# Load models
with open('models/expense_categorizer.pkl', 'rb') as f:
    clf, tfidf = pickle.load(f)
with open('models/expense_forecaster.pkl', 'rb') as f:
    lr = pickle.load(f)
# with open('models/goal_predictor.pkl', 'rb') as f:
#     goal_predictor = pickle.load(f)
# with open('models/budget_recommender.pkl', 'rb') as f:
#     kmeans = pickle.load(f)

def predict_category_logic(request):
    desc = request.json.get("description")
    
    if not desc:
        return jsonify({"error": "Description is required"}), 400

    try:
        vec = tfidf.transform([desc])
        prediction = clf.predict(vec)[0]
        return jsonify({"category": prediction}), 200
    
    except Exception as e:
        logging.error(f"Error in predicting category: {str(e)}")
        return jsonify({"error": "Failed to categorize expense", "details": str(e)}), 500
    

def forecast_expense_logic():
    with app.app_context():
        expenses = Expense.query.all()
        if not expenses:
            return jsonify({"error": "No expenses found"}), 404
        df = pd.DataFrame([(e.date, e.amount) for e in expenses], columns=['date', 'amount'])
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')
        monthly = df.groupby('month')['amount'].sum().reset_index()
        monthly['month_num'] = range(len(monthly))
    prediction = lr.predict([[len(monthly)]])[0]
    return jsonify({"predicted_expense": float(prediction)})

# def predict_goal_achievement_logic(request):
#     goal_id = request.json.get("goal_id")
#     if not goal_id:
#         return jsonify({"error": "Goal ID is required"}), 400
#     with app.app_context():
#         goal = Goal.query.filter_by(id=goal_id).first()
#         progress = SavingsProgress.query.filter_by(goalId=goal_id).first()
#     if not goal or not progress:
#         return jsonify({"error": "Goal or progress data not found"}), 404
#     prediction = goal_predictor.predict([[progress.savedAmount]])[0]
#     return jsonify({"goal_achieved": bool(prediction)})

# def recommend_budget_logic(request):
#     amount = request.json.get("amount")
#     if not amount:
#         return jsonify({"error": "Amount is required"}), 400
#     amount_array = np.array([[amount]])
#     prediction = kmeans.predict(amount_array)[0]
#     return jsonify({"recommended_budget_category": int(prediction)})
