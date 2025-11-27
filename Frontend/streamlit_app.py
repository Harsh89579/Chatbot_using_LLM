import streamlit as st
import requests
from pathlib import Path
import tempfile

st.set_page_config(page_title="LLM Chatbot", page_icon="🤖", layout="centered")

# Load dark mode CSS
css_file = Path("dark_theme.css")
if css_file.exists():
    with open(css_file) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.title("🤖 LLM Chatbot")

# Chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# ===== Text input =====
user_input = st.text_input("Type your message:")
if st.button("Send") and user_input:
    st.session_state.messages.append({"user": user_input, "bot": "..."})
    try:
        response = requests.post("http://127.0.0.1:8000/chat", params={"prompt": user_input})
        bot_reply = response.json().get("response", "")
    except:
        bot_reply = "Backend not responding."
    st.session_state.messages[-1]["bot"] = bot_reply

# ===== Voice input =====
st.subheader("Or speak to the bot 🎤")
audio_file = st.file_uploader("Upload voice (wav)", type=["wav"])
if audio_file:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_file.read())
        tmp_path = tmp.name

    try:
        files = {"file": open(tmp_path, "rb")}
        response = requests.post("http://127.0.0.1:8000/voice", files=files)
        data = response.json()
        user_text = data.get("user_text", "")
        bot_text = data.get("bot_text", "")
        audio_path = data.get("audio_file", "")
    except:
        user_text = "Error"
        bot_text = "Backend not responding."
        audio_path = None

    st.session_state.messages.append({"user": user_text, "bot": bot_text})
    if audio_path:
        audio_bytes = open(audio_path, "rb").read()
        st.audio(audio_bytes, format="audio/mp3")

# ===== Display chat history =====
for chat in st.session_state.messages:
    st.markdown(f"**You:** {chat['user']}")
    st.markdown(f"**Bot:** {chat['bot']}")
