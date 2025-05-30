from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False) # Increased length for longer hashes
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login_date = db.Column(db.DateTime, nullable=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # sessions backref will be added by Session model's user relationship
    # user = db.relationship('User', backref=db.backref('sessions', lazy=True))

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self, include_email=True):
        data = {
            'id': self.id,
            'username': self.username,
            'registration_date': self.registration_date.isoformat() if self.registration_date else None,
            'last_login_date': self.last_login_date.isoformat() if self.last_login_date else None,
            # 'session_count': len(self.sessions) # Example if you want to include session count
        }
        if include_email:
            data['email'] = self.email
        return data

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    discipline = db.Column(db.String(100), nullable=False)  # e.g., "NLH Cash", "NLH MTT", "PLO Cash"
    stake_level = db.Column(db.String(100), nullable=True) # e.g., "NL10", "$10 MTT"
    result_amount = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # New mood and emotion fields
    mood_before = db.Column(db.String(100), nullable=True) # e.g., "Excellent", "Good", "Neutral", "Bad", "Terrible"
    mood_after = db.Column(db.String(100), nullable=True)
    emotions_before = db.Column(db.JSON, nullable=True) # List of strings like ["focused", "calm"]
    emotions_after = db.Column(db.JSON, nullable=True)

    # Relationship to User
    user = db.relationship('User', backref=db.backref('sessions', lazy='dynamic')) # 'dynamic' is good for collections

    def __init__(self, user_id, start_time, end_time, discipline, result_amount, 
                 stake_level=None, notes=None, mood_before=None, mood_after=None,
                 emotions_before=None, emotions_after=None):
        self.user_id = user_id
        self.start_time = start_time
        self.end_time = end_time
        self.discipline = discipline
        self.stake_level = stake_level
        self.result_amount = result_amount
        self.notes = notes
        self.mood_before = mood_before
        self.mood_after = mood_after
        self.emotions_before = emotions_before
        self.emotions_after = emotions_after

    def __repr__(self):
        return f'<Session {self.id} for User {self.user_id} - {self.discipline} {self.stake_level or ""} - Result: {self.result_amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'discipline': self.discipline,
            'stake_level': self.stake_level,
            'result_amount': self.result_amount,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'mood_before': self.mood_before,
            'mood_after': self.mood_after,
            'emotions_before': self.emotions_before,
            'emotions_after': self.emotions_after,
        }
