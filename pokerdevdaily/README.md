# PokerDevDaily

PokerDevDaily is a (planned) web application for poker players to track their sessions, analyze their performance, and improve their game.

## Project Structure

- `backend/`: Contains the Flask (Python) backend application.
  - `app/`: Core application code (models, routes, services).
  - `migrations/`: Database migration scripts (Alembic).
  - `tests/`: Backend tests.
  - `requirements.txt`: Python dependencies.
  - `config.py`: Application configuration.
  - `run.py`: Script to run the development server.
- `frontend/`: Contains the React frontend application.
  - `public/`: Static assets and `index.html`.
  - `src/`: React components, pages, and services.
  - `package.json`: Frontend dependencies and scripts.
- `database/`: SQL scripts, ERDs, or database Docker setup.

## Tech Stack

- **Backend**: Python, Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Frontend**: JavaScript, React
- **Migrations**: Alembic (planned)

## Getting Started

(Instructions will be added here once the application is further developed)

### Prerequisites

- Python 3.x
- Node.js and npm/yarn
- PostgreSQL

### Backend Setup

```bash
cd backend
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# (Further setup for database, migrations, etc.)
# Run the development server
python run.py
```

### Frontend Setup

```bash
cd frontend
# Install dependencies
npm install  # or yarn install
# Start the development server
npm start    # or yarn start
```

## Contributing

(Contribution guidelines will be added here)

## License

(License information will be added here)
