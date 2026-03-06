# Chatbot using LLM (Text + Voice)

This project is a mini project created by Harshvardhan Tripathi.  
It is a fully-featured chatbot utilizing the Gemini LLM with a modern UI inspired by Google Gemini.

## Features
- **Text Chat:** Send text prompts to the Gemini model.
- **Voice Chat:** Click the microphone button to send speech input. The application uses `SpeechRecognition` to transcribe audio.
- **Voice Responses:** The chatbot replies with text and automatically speaks the response aloud using `gTTS`.
- **Modern UI:** A clean, responsive HTML/CSS/JS interface mirroring the Google Gemini theme (supports dark/light mode depending on system preference).

## Technologies Used
- Backend: Python, FastAPI
- Frontend: HTML, CSS, JavaScript
- AI Model: Google Gemini API (Generative AI)
- Audio Processing: SpeechRecognition, GTTS (Google Text-to-Speech)

## How to Run
1. Install Python 3.10+
2. Create virtual environment:
   `python -m venv venv`
3. Activate environment:
   `venv\Scripts\activate`
4. Install dependencies:
   `pip install -r requirements.txt` (Note: Ensure `fastapi`, `uvicorn`, `python-multipart`, `gtts`, `SpeechRecognition`, `pyaudio`, `google-generativeai` are installed).
5. Run the project:
   `run.bat`

The `run.bat` script automatically activates the environment, starts the backend server, and opens the frontend in your default browser.