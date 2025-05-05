from flask import Flask, render_template, send_from_directory, redirect
from flask_cors import CORS
from routes.api_v1 import api_v1_blueprint
import os

app = Flask(__name__)

CORS(app, origins=["http://localhost:10000", "http://127.0.0.1:10000"])
app.register_blueprint(api_v1_blueprint, url_prefix="/api/v1")

@app.route('/')
def index():
    return redirect('/apidocs/')

@app.route('/apidocs/')
def swagger_ui():
    return render_template('swaggerui.html')

if __name__ == '__main__':
    app.run(debug=True)
