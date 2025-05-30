import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

import os

# Determine the base directory of the backend
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key-that-you-should-change'
    # Use SQLite for simple local development for now
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'pokerdev.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another-super-secret-jwt-key' # For Flask-JWT-Extended
    # Add other configuration variables here

class DevelopmentConfig(Config):
    DEBUG = True
    # Add development-specific config here

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'test_pokerdev.db') # Use a separate DB for testing
    # Add testing-specific config here

class ProductionConfig(Config):
    DEBUG = False
    # Add production-specific config here

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
