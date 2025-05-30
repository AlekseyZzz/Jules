from flask import Flask
from backend.config import config
from .models import db  # Import db from models.py
from flask_jwt_extended import JWTManager
# Flask-Migrate can be added here if desired later:
from flask_migrate import Migrate # Ensure this is uncommented

# It's good practice to initialize extensions here but bind them to the app in create_app
jwt = JWTManager()
migrate = Migrate() # Initialize Migrate

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db) # Initialize Flask-Migrate with the app and db

    # Import and register blueprints here
    from .routes import auth_bp, session_bp # Added session_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(session_bp, url_prefix='/api/sessions') # Register session_bp with /api prefix

    # You can remove the simple route from the previous task
    # @app.route('/')
    # def hello():
    #     return "Hello, PokerDevDaily Backend!"

    # Create database tables if they don't exist - This will be handled by Flask-Migrate now
    # This is suitable for development. For production, use migrations.
    # The import of 'models' should already cover User and Session
    # with app.app_context():
        # from . import models # noqa - This should already be here and working
        # Make sure all models are imported before create_all is called.
        # If models.py contains 'from .models import db, User, Session',
        # then 'from .models import db' might not be enough for create_all to see Session.
        # Explicitly importing 'Session' or ensuring 'models' module is fully processed is key.
        # The current 'from .models import db' at the top and 'from . import models' here should be okay.
        # db.create_all() # Remove this line

    return app
