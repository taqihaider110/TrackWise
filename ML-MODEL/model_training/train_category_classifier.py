import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import os

def train_category_model(df):
    df = df[df['type'].str.lower() == 'debit']
    df = df.dropna(subset=['description', 'category'])

    df['description'] = df['description'].apply(lambda x: x.strip() if isinstance(x, str) else "")
    df = df[df['description'].str.len() > 3]

    if df.empty:
        print("No valid data available for training!")
        return

    X = df['description']
    y = df['category']

    vectorizer = TfidfVectorizer(stop_words='english')
    X_vec = vectorizer.fit_transform(X)

    if X_vec.shape[1] == 0:
        print("Empty vocabulary after TF-IDF. Check the descriptions.")
        return

    model = MultinomialNB()
    model.fit(X_vec, y)

    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/category_classifier.pkl')
    joblib.dump(vectorizer, 'models/vectorizer.pkl')

    print("Model trained and saved successfully.")
