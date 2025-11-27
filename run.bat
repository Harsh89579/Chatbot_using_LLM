@echo off
REM Activate venv
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Start backend in new window
echo Starting Backend...
start cmd /k "cd Backend && uvicorn app:app --reload"

REM Wait 3 seconds before starting frontend
timeout /t 3

REM Start frontend in new window
echo Starting Frontend...
start cmd /k "cd frontend && streamlit run streamlit_app.py"

echo All processes started!
pause