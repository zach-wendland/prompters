import streamlit as st
from pages.core.prompt_agent import PromptRefinementAgent
import time
import json
import sounddevice as sd
import numpy as np
import os

st.set_page_config(
    page_title="🧠 Prompt Refiner",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Add custom CSS for styling
st.markdown(
    """
    <style>
    /* General page styling */
    body {
        background-color: #0B0C10;
        color: #C5C6C7;
        font-family: 'Share Tech Mono', monospace;
    }

    /* Title styling */
    .stTitle {
        color: #66FCF1;
        text-align: center;
        font-size: 2.5em;
        margin-bottom: 0.5em;
    }

    /* Subtitle styling */
    .stMarkdown {
        text-align: center;
        font-size: 1.2em;
        color: #45A29E;
    }

    /* Input area styling */
    textarea {
        background-color: #1F2833;
        color: #C5C6C7;
        border: 1px solid #45A29E;
        font-family: 'Share Tech Mono', monospace;
        padding: 10px;
        border-radius: 5px;
    }

    /* Button styling */
    button {
        background-color: #45A29E;
        color: #0B0C10;
        border: none;
        padding: 10px 20px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 1em;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #66FCF1;
    }

    /* Number input styling */
    input[type="number"] {
        background-color: #1F2833;
        color: #C5C6C7;
        border: 1px solid #45A29E;
        font-family: 'Share Tech Mono', monospace;
        padding: 5px;
        border-radius: 5px;
    }

    /* Dropdown styling */
    select {
        background-color: #1F2833;
        color: #C5C6C7;
        border: 1px solid #45A29E;
        font-family: 'Share Tech Mono', monospace;
        padding: 5px;
        border-radius: 5px;
    }

    </style>
    """,
    unsafe_allow_html=True
)

st.title("🧠 PROMPT REFINER")
st.markdown('<div style="margin-bottom: 2em;">💼 Blacksite-level prompt transformation</div>', unsafe_allow_html=True)

# Initialize the agent with the API key from session state
agent = PromptRefinementAgent(api_key=st.session_state["api_key"])

# Initialize all session state variables
if "refined_output" not in st.session_state:
    st.session_state.refined_output = None
if "timestamp" not in st.session_state:
    st.session_state.timestamp = 0
if "refinement_count" not in st.session_state:
    st.session_state.refinement_count = 0
if "user_decision" not in st.session_state:
    st.session_state.user_decision = None
if "chat_started" not in st.session_state:
    st.session_state.chat_started = False
if "final_prompt_for_chat" not in st.session_state:
    st.session_state.final_prompt_for_chat = None
if "raw_input_cache" not in st.session_state:
    st.session_state.raw_input_cache = ""
if "style_select_cache" not in st.session_state:
    st.session_state.style_select_cache = agent.Style.all()[0]
if "context_input_cache" not in st.session_state:
    st.session_state.context_input_cache = ""
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "success" not in st.session_state:
    st.session_state.success = None
if "error" not in st.session_state:
    st.session_state.error = None
if "raw_input" not in st.session_state:
    st.session_state.raw_input = ""
if "style_select" not in st.session_state:
    st.session_state.style_select = agent.Style.all()[0]
if "context_input" not in st.session_state:
    st.session_state.context_input = ""

# Initialize additional session state variables
if "is_recording" not in st.session_state:
    st.session_state.is_recording = False
if "audio_duration" not in st.session_state:
    st.session_state.audio_duration = 5

def handle_audio_input():
    try:
        with st.spinner("🎙️ Recording..."):
            try:
                # Check if audio device is available
                sd.query_devices(None, 'input')
            except sd.PortAudioError:
                st.warning("⚠️ No audio device detected. This feature requires a microphone.")
                return

            audio_file = agent.record_audio(duration=st.session_state.audio_duration)
            transcript = agent.transcribe_audio(file_path=audio_file)
            st.session_state.raw_input = transcript
            # Clean up
            if os.path.exists(audio_file):
                os.remove(audio_file)
    except Exception as e:
        st.error(f"Error recording audio: {str(e)}")


# Function to trigger refinement
def trigger_refinement():
    if not st.session_state.raw_input_cache.strip():
        st.session_state.error = "❌ NEGATIVE, OPERATOR. Feed me a prompt."
        st.session_state.refined_output = None
        st.session_state.user_decision = None
        st.session_state.refinement_count = 0
        st.session_state.chat_started = False
        return

    try:
        # Get fresh refinement using cached inputs
        refined = agent.refine(
            st.session_state.raw_input_cache,
            st.session_state.style_select_cache,
            st.session_state.context_input_cache
        )
        st.session_state.refined_output = refined
        st.session_state.success = f"✅ TACTICAL REWRITE COMPLETE (Attempt {st.session_state.refinement_count + 1})"
        st.session_state.error = None
        st.session_state.user_decision = None # Reset decision state for the new refinement
    except Exception as e:
        st.session_state.error = f"🚨 REFINEMENT FAILED (Attempt {st.session_state.refinement_count + 1}): {str(e)}"
        st.session_state.refined_output = None
        st.session_state.success = None
        st.session_state.user_decision = None
        # Potentially reset state further if refinement fails critically
        # st.session_state.refinement_count = 0
        # st.session_state.chat_started = False

# Callback for the initial form submission
def process_initial_prompt():
    if not st.session_state.raw_input.strip():
        st.session_state.error = "❌ NEGATIVE, OPERATOR. Feed me a prompt."
        st.session_state.refined_output = None
        st.session_state.refinement_count = 0
        st.session_state.chat_started = False
        st.session_state.user_decision = None
        return

    # Cache the inputs
    st.session_state.raw_input_cache = st.session_state.raw_input
    st.session_state.style_select_cache = st.session_state.style_select
    st.session_state.context_input_cache = st.session_state.context_input

    # Reset state for a new refinement cycle
    st.session_state.refinement_count = 0
    st.session_state.chat_started = False
    st.session_state.user_decision = None
    st.session_state.refined_output = None
    st.session_state.success = None
    st.session_state.error = None
    st.session_state.timestamp = time.time() # Force rerun if needed

    trigger_refinement() # Perform the first refinement

# Callback for Accept button
def handle_accept():
    st.session_state.user_decision = 'accepted'
    st.session_state.final_prompt_for_chat = st.session_state.refined_output
    st.session_state.chat_started = True
    st.success("✅ PROMPT ACCEPTED. Initiating Chat Flow...")

# Callback for Reject button
def handle_reject():
    st.session_state.user_decision = 'rejected'
    st.session_state.refinement_count += 1
    if st.session_state.refinement_count < 3:
        st.warning(f"❌ PROMPT REJECTED. Refining again (Attempt {st.session_state.refinement_count + 1})...")
        trigger_refinement() # Trigger next refinement
    else:
        st.warning("❌ FINAL REJECTION. Proceeding with last refinement.")
        # The last refinement was already triggered by the previous reject or initial submit
        # Ensure the final prompt is set
        st.session_state.final_prompt_for_chat = st.session_state.refined_output
        st.session_state.chat_started = True # Start chat after final rejection


# --- UI Rendering ---

if not st.session_state.chat_started:
    st.markdown("---")
    st.markdown("### 🎙️ Record or Paste Your Prompt")

    col1, col2 = st.columns([3, 1])

    with col1:
        st.text_area(
            "Raw Prompt",
            placeholder="Paste your broken mess here, operator...",
            height=200,
            key="raw_input",
            value=st.session_state.get("raw_input_cache", "")
        )

    with col2:
        st.number_input(
            "Recording Duration (s)",
            min_value=1,
            max_value=30,
            value=5,
            key="audio_duration",
            help="Duration in seconds for audio recording"
        )
        if st.button("🎙️ Record Audio", help="Click to record audio input"):
            handle_audio_input()

    st.markdown("---")
    st.markdown("### 🛠️ Customize Your Refinement")

    col3, col4 = st.columns([2, 1])

    with col3:
        styles = agent.Style.all()
        current_style = st.session_state.get("style_select_cache", styles[0])
        if current_style not in styles:
            current_style = styles[0]
        st.selectbox(
            "Tactical Style",
            styles,
            index=styles.index(current_style),
            key="style_select"
        )

    with col4:
        st.text_input(
            "Mission Context",
            placeholder="Optional: What's the objective?",
            key="context_input",
            value=st.session_state.get("context_input_cache", "")
        )

    st.markdown("---")
    st.markdown("### 🚀 Execute Refinement")

    if st.button("⚡ EXECUTE REFINEMENT", use_container_width=True):
        process_initial_prompt()

    if st.session_state.get("error"):
        st.error(st.session_state.error)

    if st.session_state.get("success"):
        st.success(st.session_state.success)

    if st.session_state.refined_output and st.session_state.user_decision is None:
        st.markdown("---")
        st.markdown("#### Refined Prompt:")
        st.text_area(
            "Refined Output",
            value=st.session_state.refined_output,
            height=150,
            key="refined_output_display",
            disabled=True
        )

        col5, col6 = st.columns([1, 1])
        with col5:
            st.button("✅ Accept", on_click=handle_accept, use_container_width=True)
        with col6:
            st.button("❌ Reject", on_click=handle_reject, use_container_width=True)

elif st.session_state.chat_started:
    st.markdown("---")
    st.header("💬 Chat Interface")
    st.markdown(f"**Using Prompt:**")
    st.code(st.session_state.final_prompt_for_chat, language='text')

    # Display chat history
    for i, message in enumerate(st.session_state.chat_history):
        with st.chat_message(message["role"]):
            st.write(message["content"])

    # Chat input
    if prompt := st.chat_input("What do you say, Glendale?"):
        # Add user message to chat history
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        
        # Display user message immediately
        with st.chat_message("user"):
            st.write(prompt)

        # Display assistant response with a typing indicator
        with st.chat_message("assistant"):
            response = agent.chat(
                prompt,
                st.session_state.final_prompt_for_chat,
                st.session_state.chat_history
            )
            st.write(response)

        # Add assistant response to chat history
        st.session_state.chat_history.append({"role": "assistant", "content": response})

    # Reset button
    col1, col2, col3 = st.columns([1,2,1])
    with col1:
        if st.button("🔄 Start New Refinement"):
            # Reset relevant state variables
            st.session_state.refined_output = None
            st.session_state.refinement_count = 0
            st.session_state.user_decision = None
            st.session_state.chat_started = False
            st.session_state.final_prompt_for_chat = None
            st.session_state.raw_input_cache = ""
            st.session_state.style_select_cache = ""
            st.session_state.context_input_cache = ""
            st.session_state.success = None
            st.session_state.error = None
            st.session_state.chat_history = []
            st.rerun()