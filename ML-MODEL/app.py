from flask import Flask, request, jsonify, render_template
from sqlalchemy import create_engine
import pandas as pd
import os
import joblib
from dotenv import load_dotenv
from model_training.train_category_classifier import train_category_model
from model_training.train_expense_predictor import train_expense_model

# Load environment variables
load_dotenv()

app = Flask(__name__)

# DB Config
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Setup SQLAlchemy engine
engine = create_engine(DATABASE_URL)

@app.route("/", methods=["GET"])
def landing_page():
    return render_template("landing_page.html", message="Welcome to the AI-Driven Personal Finance Tracker!")

@app.route("/train", methods=["POST"])
def train_models():
    try:
        # Check if a file is uploaded via the form
        file = request.files.get("dataset")
        
        # If file is uploaded via form
        if file:
            dataset_df = pd.read_csv(file)
        else:
            # Check if Personal_Finance_Dataset.csv file exists in the current directory
            file_path = os.path.join(os.getcwd(), "Personal_Finance_Dataset.csv")
            
            # If file does not exist, return an error message
            if not os.path.exists(file_path):
                return jsonify({"error": "Personal_Finance_Dataset.csv file not found in the directory!"}), 400
            
            # Read CSV into a DataFrame
            dataset_df = pd.read_csv(file_path)

        # Ensure columns are formatted properly (e.g., lowercase and spaces replaced by underscores)
        dataset_df.columns = [c.lower().replace(" ", "_") for c in dataset_df.columns]

        # Load Expense and Income from the production DB
        expense_df = pd.read_sql("SELECT date, description, category, amount FROM \"Expenses\"", engine)
        expense_df["type"] = "debit"

        income_df = pd.read_sql("SELECT date, source AS description, category, amount FROM \"Incomes\"", engine)
        income_df["type"] = "credit"

        # Combine the DB data and dataset (from file or manual upload)
        db_df = pd.concat([expense_df, income_df], ignore_index=True)
        db_df.columns = [c.lower().replace(" ", "_") for c in db_df.columns]

        # Merge datasets
        full_df = pd.concat([dataset_df, db_df], ignore_index=True)

        # Check if there is enough data for training
        if full_df.empty or full_df['description'].isnull().all():
            return jsonify({"error": "Dataset has insufficient data or no descriptions for training!"}), 400

        # Train models
        train_category_model(full_df)
        train_expense_model(full_df)

        return jsonify({"message": "Training completed successfully!"})
    except Exception as e:
        return jsonify({"error": f"Error during training: {str(e)}"}), 500
        
@app.route("/predict-category", methods=["POST"])
def predict_category():
    try:
        description = request.json.get("description")
        
        # Validate input
        if not description:
            return jsonify({"error": "Description is required for category prediction!"}), 400
        
        # Load the model and vectorizer
        vectorizer = joblib.load("models/vectorizer.pkl")
        model = joblib.load("models/category_classifier.pkl")
        
        # Vectorize the input description
        vector = vectorizer.transform([description])
        
        # Predict category
        category = model.predict(vector)[0]
        
        return jsonify({"predicted_category": category})
    except Exception as e:
        return jsonify({"error": f"Error during category prediction: {str(e)}"}), 500

@app.route("/predict-expense", methods=["POST"])
def predict_expense():
    try:
        amount = request.json.get("amount")
        
        # Validate input
        if not amount or not isinstance(amount, (int, float)):
            return jsonify({"error": "Valid amount is required for expense prediction!"}), 400
        
        # Load the model
        model = joblib.load("models/expense_predictor.pkl")
        
        # Predict next expense based on the amount
        prediction = model.predict([[amount]])[0]
        
        return jsonify({"predicted_next_expense": prediction})
    except Exception as e:
        return jsonify({"error": f"Error during expense prediction: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
    