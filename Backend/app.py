from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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
    audio_output = text_to_speech(bot_reply)
    return {"user_text": text, "bot_text": bot_reply, "audio_file": audio_output}

