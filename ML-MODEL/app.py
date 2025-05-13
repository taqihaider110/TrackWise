from flask import Flask, render_template, redirect
from flask_cors import CORS
from routes.api_v1 import api_v1_blueprint
from db import app as db_app
from training.train_all_models import train_all_models
from Controllers.ai_controller import load_models

app = Flask(__name__)

CORS(app, origins=["http://localhost:10000", "http://127.0.0.1:10000"])
app.register_blueprint(api_v1_blueprint, url_prefix="/api/v1")

@app.route('/')
def index():
    return redirect('/apidocs/')

@app.route('/apidocs/')
def swagger_ui():
    return render_template('swaggerui.html')

def startup_tasks():
    """Train models and load them on startup"""
    with db_app.app_context():
        print("Training all models...")
        train_all_models()
        print("Loading models...")
        load_models()
        print("Startup tasks completed.")

startup_tasks()

if __name__ == '__main__':
    app.run(debug=True)
