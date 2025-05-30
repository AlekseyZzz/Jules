import os
from app import create_app

# Get the configuration name from the environment variable or use default
config_name = os.getenv('FLASK_CONFIG') or 'default'
app = create_app(config_name)

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', True))
