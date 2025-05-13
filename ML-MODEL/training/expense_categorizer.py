import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
from models import Expense
from db import app  # Flask app with SQLAlchemy

def train_expense_categorizer(expenses):
    """ Train and save the expense categorizer model """
    exp_df = pd.DataFrame([(e.description, e.category) for e in expenses if e.description], columns=["description", "category"])
    
    if exp_df.empty:
        print("⚠️ No valid expense data with descriptions found.")
        return

    # Vectorization and training
    tfidf = TfidfVectorizer()
    X = tfidf.fit_transform(exp_df['description'])
    y = exp_df['category']
    
    clf = MultinomialNB()
    clf.fit(X, y)

    # Ensure 'models/' folder exists
    import os
    os.makedirs('training/models', exist_ok=True)

    # Save the trained model and vectorizer
    with open('training/models/expense_categorizer.pkl', 'wb') as f:
        pickle.dump((clf, tfidf), f)

    print("✅ Expense Categorization Model trained and saved successfully!")

if __name__ == "__main__":
    with app.app_context():
        expenses = Expense.query.all()
        if expenses:
            train_expense_categorizer(expenses)
        else:
            print("⚠️ No expenses found in the database to train the model.")
