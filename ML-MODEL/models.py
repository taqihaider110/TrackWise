from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    expenses = db.relationship('Expense', backref='user', lazy=True)
    incomes = db.relationship('Income', backref='user', lazy=True)
    goals = db.relationship('Goal', backref='user', lazy=True)
    savings_progress = db.relationship('SavingsProgress', backref='user', lazy=True)


class Expense(db.Model):
    __tablename__ = 'Expenses'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String, nullable=True)
    date = db.Column(db.Date, nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Income(db.Model):
    __tablename__ = 'Incomes'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    source = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Goal(db.Model):
    __tablename__ = 'Goals'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    title = db.Column(db.String(255), nullable=False)
    targetAmount = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.Date, nullable=True)
    description = db.Column(db.String, nullable=True)

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    savings_progress = db.relationship('SavingsProgress', backref='goal', lazy=True)


class SavingsProgress(db.Model):
    __tablename__ = 'SavingsProgress'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    goalId = db.Column(db.Integer, db.ForeignKey('Goals.id'), nullable=True)

    month = db.Column(db.String(20), nullable=False)
    totalIncome = db.Column(db.Float, nullable=False, default=0.0)
    totalExpense = db.Column(db.Float, nullable=False, default=0.0)
    savings = db.Column(db.Float, nullable=False, default=0.0)

    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('userId', 'month', name='_user_month_uc'),)
