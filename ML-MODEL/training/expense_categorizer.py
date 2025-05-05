import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

def train_expense_categorizer(expenses):
    """ Train and save the expense categorizer model """
    exp_df = pd.DataFrame([(e.description, e.category) for e in expenses if e.description], columns=["description", "category"])
    
    # Vectorization and training
    tfidf = TfidfVectorizer()
    X = tfidf.fit_transform(exp_df['description'])
    y = exp_df['category']
    
    clf = MultinomialNB()
    clf.fit(X, y)
    
    # Save the trained model and vectorizer
    with open('models/expense_categorizer.pkl', 'wb') as f:
        pickle.dump((clf, tfidf), f)
    
    print("✅ Expense Categorization Model trained and saved successfully!")
