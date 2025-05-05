import pandas as pd
from sklearn.linear_model import LogisticRegression
import pickle

def train_goal_predictor(goals, progress):
    """ Train and save the goal achievement prediction model """
    goal_df = pd.DataFrame([(g.id, g.targetAmount) for g in goals], columns=['goalId', 'target'])
    prog_df = pd.DataFrame([(p.goalId, p.savedAmount) for p in progress], columns=['goalId', 'saved'])
    merged = pd.merge(goal_df, prog_df, on='goalId')
    merged['achieved'] = merged['saved'] >= merged['target']
    
    # Train the logistic regression model
    lr_clf = LogisticRegression()
    lr_clf.fit(merged[['saved']], merged['achieved'])
    
    # Save the trained goal prediction model
    with open('models/goal_predictor.pkl', 'wb') as f:
        pickle.dump(lr_clf, f)
    
    print("✅ Goal Achievement Prediction Model trained and saved successfully!")
