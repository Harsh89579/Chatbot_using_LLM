@echo off
REM Activate venv
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing latest FastAPI and Uvicorn...
pip install fastapi uvicorn python-multipart gtts SpeechRecognition pyaudio

REM Start backend and serve frontend
echo Starting Backend...
cd Backend
start /b uvicorn app:app --reload

REM Wait 3 seconds for it to boot
timeout /t 3

echo Opening browser...
start http://127.0.0.1:8000/
echo All processes started!
pause