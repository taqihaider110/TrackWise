from flask import jsonify
import logging
import pickle
import numpy as np
import pandas as pd
from models import Expense, Goal, SavingsProgress
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from db import app
import os

# Global model holders
clf, tfidf, expense_lr_model, budget_model_data = None, None, None, None

def load_models():
    global clf, tfidf, expense_lr_model, budget_model_data
    try:
        with open('models/expense_categorizer.pkl', 'rb') as f:
            clf, tfidf = pickle.load(f)
        with open('models/expense_forecaster.pkl', 'rb') as f:
            expense_lr_model = pickle.load(f)
        with open('models/budget_recommender.pkl', 'rb') as f:
            budget_model_data = pickle.load(f)
        # with open('models/goal_predictor.pkl', 'rb') as f:
        #     goal_predictor = pickle.load(f)
        print("Models loaded successfully.")
    except Exception as e:
        logging.error(f"Error loading models: {e}")
        raise

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

def forecast_expense_logic(request):
    with app.app_context():
        expenses = Expense.query.all()
        if not expenses:
            return jsonify({"error": "No expenses found"}), 404

        df = pd.DataFrame([(e.date, e.amount) for e in expenses], columns=['date', 'amount'])
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')
        monthly = df.groupby('month')['amount'].sum().reset_index()
        monthly['month_num'] = range(len(monthly))

    X = monthly['month_num'].values.reshape(-1, 1)
    y = monthly['amount'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    prediction = model.predict([[len(monthly)]])[0]

    return jsonify({
        "predicted_expense": float(prediction),
        "mae": mean_absolute_error(y_test, y_pred),
        "mse": mean_squared_error(y_test, y_pred),
        "rmse": mean_squared_error(y_test, y_pred, squared=False),
        "r2_score": r2_score(y_test, y_pred)
    })

def recommend_budget_logic(request):
    amount = request.json.get("amount")
    if not amount:
        return jsonify({"error": "Amount is required"}), 400

    try:
        global budget_model_data
        if budget_model_data is None:
            return jsonify({"error": "Budget recommendation model not loaded"}), 500
            
        kmeans = budget_model_data['kmeans']
        scaler = budget_model_data['scaler']
        feature_columns = budget_model_data['feature_columns']
        cluster_profiles = budget_model_data['cluster_profiles']
        
        # Create a feature vector for the new amount
        # We'll use average percentages for initial categorization
        features = np.zeros(len(feature_columns))
        features[-1] = 100  # Set income utilization to 100% initially
        
        # Scale the features
        features_scaled = scaler.transform([features])
        
        # Predict the cluster
        cluster = kmeans.predict(features_scaled)[0]
        profile = cluster_profiles[cluster]
        
        # Calculate recommended amounts for each category
        recommendations = {
            category: round((percentage / 100.0) * float(amount), 2)
            for category, percentage in profile['allocations'].items()
            if not category.endswith('_pct') and category != 'income_utilization'
        }
        
        return jsonify({
            "spender_type": profile['type'],
            "total_budget": float(amount),
            "category_percentages": {
                k: v for k, v in profile['allocations'].items()
                if not k.endswith('_pct') and k != 'income_utilization'
            },
            "recommended_amounts": recommendations
        })
        
    except Exception as e:
        logging.error(f"Error in recommending budget: {str(e)}")
        return jsonify({"error": "Failed to recommend budget", "details": str(e)}), 500


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