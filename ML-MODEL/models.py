from db import db

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)

class Expense(db.Model):
    __tablename__ = 'Expenses'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date = db.Column(db.Date)

class Income(db.Model):
    __tablename__ = 'Incomes'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    source = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String, nullable=False)

class Goal(db.Model):
    __tablename__ = 'Goals'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    targetAmount = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.Date, nullable=False)
    description = db.Column(db.String)

class SavingsProgress(db.Model):
    __tablename__ = 'SavingsProgress'
    id = db.Column(db.Integer, primary_key=True)
    goalId = db.Column(db.Integer, db.ForeignKey('Goals.id'), nullable=False)
    savedAmount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date)
