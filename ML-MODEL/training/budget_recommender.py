import pandas as pd
from sklearn.cluster import KMeans
import pickle

def train_budget_recommender(expenses):
    """ Train and save the budget recommendation model """
    X = pd.DataFrame([(e.amount,) for e in expenses], columns=['amount'])
    
    # Train the KMeans clustering model
    kmeans = KMeans(n_clusters=3, n_init=10)
    kmeans.fit(X)
    
    # Save the trained budget recommendation model
    with open('models/budget_recommender.pkl', 'wb') as f:
        pickle.dump(kmeans, f)
    
    print("✅ Budget Recommendation Model trained and saved successfully!")
