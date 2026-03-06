from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import base64
import os
from gemini_service import generate_text
from utils.speech_to_text import speech_to_text
from utils.text_to_speech import text_to_speech

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend directory for static files
app.mount("/static", StaticFiles(directory="../Frontend"), name="static")

@app.get("/")
async def root():
    return FileResponse("../Frontend/index.html")

@app.post("/chat")
async def chat(prompt: str):
    response = generate_text(prompt)
    return {"response": response}

@app.post("/voice")
async def voice(file: UploadFile = File(...)):
    temp_audio = "temp_audio.wav"
    with open(temp_audio, "wb") as buffer:
        buffer.write(await file.read())
    text = speech_to_text(temp_audio)
    bot_reply = generate_text(text)
    
    # Generate MP3 and convert to base64
    audio_output = text_to_speech(bot_reply)
    with open(audio_output, "rb") as audio_file:
        audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
        
    # Cleanup temporary files
    if os.path.exists(temp_audio):
        try:
            os.remove(temp_audio)
        except Exception as e:
            print(f"Cleanup error on {temp_audio}: {e}")
            
    if os.path.exists(audio_output):
        try:
            os.remove(audio_output)
        except Exception as e:
            print(f"Cleanup error on {audio_output}: {e}")
        
    return {"user_text": text, "bot_text": bot_reply, "audio_base64": audio_base64}
