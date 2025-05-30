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
- `database/`: SQL scripts, ERDs, or database Docker setup (currently holds `.gitkeep`).

## Tech Stack

- **Backend**: Python, Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- **Database**: SQLite (for development), PostgreSQL (planned for production)
- **Frontend**: JavaScript, React, React Router, Axios
- **Styling**: Plain CSS, react-calendar default styles

## Getting Started

This section provides instructions on how to set up and run the PokerDevDaily application locally for development.

### Prerequisites

- **Python:** Version 3.8 or higher.
- **pip:** Python package installer (usually comes with Python).
- **Node.js:** LTS version recommended. This includes `npm` (Node Package Manager). You can download Node.js from [https://nodejs.org/](https://nodejs.org/).
- **yarn (Optional):** If you prefer to use yarn as your package manager for the frontend, install it globally after installing Node.js.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd pokerdevdaily/backend
    ```

2.  **Create and activate a Python virtual environment:**
    This keeps your project dependencies isolated.
    ```bash
    # For Windows
    python -m venv venv
    venv\Scripts\activate

    # For macOS and Linux
    python3 -m venv venv  # Or python -m venv venv if python3 is your default
    source venv/bin/activate
    ```
    You should see `(venv)` at the beginning of your terminal prompt.

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up Environment Variables (Optional but Recommended):**
    The application uses Flask environment variables. While `run.py` and `config.py` provide defaults for development, you can set them explicitly:
    ```bash
    # For macOS and Linux
    export FLASK_APP=run.py
    export FLASK_ENV=development

    # For Windows (Command Prompt)
    set FLASK_APP=run.py
    set FLASK_ENV=development

    # For Windows (PowerShell)
    $env:FLASK_APP = "run.py"
    $env:FLASK_ENV = "development"
    ```
    - `FLASK_APP=run.py`: Tells Flask where the application instance is.
    - `FLASK_ENV=development`: Enables debug mode and other development features.
    - **Security Keys**: `SECRET_KEY` and `JWT_SECRET_KEY` are defined in `config.py` with development defaults. For a production environment, these **must** be set as strong, random environment variables.

5.  **Initialize and Upgrade the Database:**
    The application uses Flask-Migrate (with Alembic) to manage database schema changes.
    - **If the `migrations` folder does *not* exist** (i.e., first time setting up migrations for this project):
      ```bash
      flask db init 
      ```
      This creates the `migrations` directory. You only need to run this once per project.
    - **To generate a new migration script after model changes** (less common for initial setup, more for ongoing development):
      ```bash
      flask db migrate -m "Descriptive message for your model changes"
      ```
      Review the generated script in the `migrations/versions/` directory.
    - **To apply existing migrations to your database:**
      This is the most common command you'll run to set up your database schema according to the existing migration scripts.
      ```bash
      flask db upgrade
      ```
      This will create the `pokerdev.db` SQLite file (if it doesn't exist) and build all tables.

6.  **Run the Backend Server:**
    You can use either `flask run` or execute `run.py` directly:
    ```bash
    flask run
    ```
    Or:
    ```bash
    python run.py
    ```
    The backend server should now be running, typically on `http://127.0.0.1:5000/`. You'll see output in your terminal indicating it's running.

### Frontend Setup

1.  **Prerequisites Check:**
    Ensure you have Node.js and npm installed (see main "Prerequisites" section). If you plan to use `yarn`, make sure it's installed.

2.  **Navigate to the frontend directory:**
    (If you are in the `pokerdevdaily/backend` directory, use `cd ../frontend`. If you are at the project root `pokerdevdaily/`, use `cd frontend`.)
    ```bash
    cd pokerdevdaily/frontend 
    ```

3.  **Install JavaScript dependencies:**
    The project uses `npm` by default (as indicated by `package-lock.json` if it were present, or just generally `package.json` is `npm`-first).
    ```bash
    npm install 
    ```
    If you prefer to use `yarn` (and have a `yarn.lock` file or wish to generate one):
    ```bash
    yarn install
    ```

4.  **Start the Frontend Development Server:**
    ```bash
    npm start
    ```
    Or with `yarn`:
    ```bash
    yarn start
    ```
    This will usually open the application in your default web browser (typically at `http://localhost:3000/`). The development server will also watch for file changes and automatically reload the page.

5.  **Important Note on Backend Dependency:**
    The frontend application makes API calls to the backend server. **Ensure the backend server is running (as per the "Backend Setup" instructions) before starting and using the frontend application.** Otherwise, features requiring data from the backend (like login, registration, session tracking, etc.) will not work. The frontend is typically configured to proxy requests to `http://localhost:5000` (the default backend address).

## Testing the Application (MVP Functionality)

Once both the backend and frontend servers are running (see "Backend Setup" and "Frontend Setup" above), you can test the core features of the application:

1.  **Access the Application:**
    - Open your web browser and navigate to `http://localhost:3000` (or the address your frontend server is using, typically shown in the terminal when you run `npm start`).

2.  **Register a New User:**
    - Click on the "Register" link or navigate to the registration page.
    - Fill in the required fields: username, email, and a password (at least 8 characters).
    - Click the "Register" button.
    - Upon successful registration, you should typically be redirected to the "Login" page, possibly with a success message.

3.  **Log In:**
    - On the "Login" page, enter the email (or username) and password of the user you just registered.
    - Click the "Login" button.
    - Upon successful login, you should be redirected to the main Dashboard.

4.  **Dashboard & Recommendations:**
    - On the Dashboard, you should see:
        - A welcome message or user-specific information.
        - A section displaying a "Poker Tip / Recommendation". Try clicking the "Get Another Tip" button to see it change (if multiple tips are available).

5.  **Add a Poker Session:**
    - Locate the "Add New Session" button or form on the Dashboard.
    - Fill in the details for a poker session:
        - **Start Time and End Time:** Use the date-time pickers. Ensure Start Time is before End Time.
        - **Discipline:** e.g., "NLH Cash", "PLO MTT".
        - **Stake/Level:** e.g., "NL10", "$22 Tournament".
        - **Result:** Enter a number (positive for profit, negative for loss, e.g., `25.50` or `-10.25`).
        - **Notes (Optional):** Any relevant notes about the session.
    - Click "Create Session" (or similar button).
    - The newly added session should appear in the list of sessions displayed on the Dashboard.

6.  **View Sessions on Calendar:**
    - Find the navigation link for the "Calendar" (usually in the main navigation bar).
    - Click to go to the Calendar page.
    - The calendar should display the current month. Days on which you recorded sessions (based on their Start Time) should be visually highlighted.
    - You should be able to navigate to previous/next months to see other highlighted days.

7.  **Edit and Delete a Session (Optional but good to check):**
    - Return to the Dashboard page where the list of sessions is displayed.
    - For one of your recorded sessions, click the "Edit" button.
        - The session form should appear, pre-filled with the session's data.
        - Modify some details (e.g., change the result amount or add a note).
        - Click "Update Session". The list should reflect the changes.
    - For one of your recorded sessions (or a different one), click the "Delete" button.
        - You might be asked for confirmation.
        - After confirming, the session should be removed from the list.

8.  **Log Out:**
    - Click on the "Logout" button (this is usually on the Dashboard page or in the main navigation bar).
    - You should be redirected to the "Login" page or the application's home page.
    - Attempt to navigate to a protected page like the Dashboard or Calendar page. You should be prevented from accessing it and likely redirected back to the login page.

These steps cover the main user flows and features of the PokerDevDaily MVP.

## Contributing

(Contribution guidelines will be added here once the project is more mature)

## License

(License information will be added here)
```
