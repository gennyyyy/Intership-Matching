# Running the Internship Matching System Locally

To make development easier, we've set up a single command to run both the React frontend and the FastAPI backend simultaneously.

## Prerequisites

1.  Make sure you have installed the npm dependencies in the main folder:
    ```bash
    npm install
    ```
2.  Make sure you have set up the Python virtual environment and installed backend dependencies (we did this in Sprint 1):
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    cd ..
    ```
3.  Make sure MongoDB is running locally on your machine on the default port `27017`.

## Starting the Application

From the root project folder (`Internship Matching`), simply run:

```bash
npm run dev:all
```

This uses the `concurrently` package to:
1.  Start the Vite development server for the React frontend (running on `http://localhost:5173`).
2.  Start the Uvicorn server for the FastAPI backend (running on `http://localhost:8000`).

### Viewing the App
- **Frontend App**: Open your browser to http://localhost:5173 
- **Backend API Docs**: Open your browser to http://localhost:8000/docs or http://localhost:8000/redoc
