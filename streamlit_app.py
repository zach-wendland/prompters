import streamlit as st
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

st.set_page_config(
    page_title="🛡️Prompter",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Share+Tech+Mono&display=swap');
        
        /* Main App Styling */
        .stApp {
            background: linear-gradient(180deg, #0B0C10 0%, #1F2833 100%);
        }
        
        /* Sidebar Styling */
        section[data-testid="stSidebar"] {
            background-color: #1F2833;
            border-right: 2px solid #14FFEC;
        }
        section[data-testid="stSidebar"] .stMarkdown {
            color: #C5C6C7;
        }
        
        /* Text Styling */
        h1, h2, h3 {
            font-family: 'Orbitron', sans-serif !important;
            color: #C5C6C7 !important;
            text-shadow: 0 0 10px rgba(20, 255, 236, 0.5);
        }
        p, div {
            font-family: 'Share Tech Mono', monospace !important;
            color: #C5C6C7;
        }
        
        /* Form Elements */
        .stTextArea, .stTextInput {
            background-color: #1F2833 !important;
            color: #C5C6C7 !important;
            border: 1px solid #14FFEC !important;
        }
        .stTextArea:focus, .stTextInput:focus {
            box-shadow: 0 0 10px rgba(20, 255, 236, 0.5) !important;
        }
        
        /* Buttons */
        .stButton button {
            background-color: #14FFEC !important;
            color: #0B0C10 !important;
            font-family: 'Orbitron', sans-serif !important;
            border: none !important;
            transition: all 0.3s ease;
        }
        .stButton button:hover {
            background-color: #45A29E !important;
            box-shadow: 0 0 15px rgba(20, 255, 236, 0.7) !important;
        }
        
        /* Code Blocks */
        .stCodeBlock {
            background-color: #1F2833 !important;
            border: 1px solid #14FFEC !important;
        }
        
        /* Success/Error Messages */
        .stSuccess, .stError {
            font-family: 'Share Tech Mono', monospace !important;
            border: 1px solid #14FFEC !important;
        }
    </style>
""", unsafe_allow_html=True)

# Move API key handling to sidebar
with st.sidebar:
    st.markdown("### ⚙️ Configuration")
    
    # Enter your OpenAI API key securely
    if "api_key" not in st.session_state:
        # Try to get API key from environment first
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            st.session_state["api_key"] = api_key
        else:
            # Use the default key if environment variable is not set
            st.session_state["api_key"] = "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"

    # Update the API key in session state when input changes
    api_key_input = st.text_input(
        "OpenAI API Key:",
        value=st.session_state["api_key"],
        type="password",
        key="api_key_input",
        help="Your OpenAI API key will be securely stored in the session state"
    )

    if api_key_input != st.session_state["api_key"]:
        st.session_state["api_key"] = api_key_input
        st.rerun()  # Rerun to ensure all components update with new API key

    if not st.session_state["api_key"]:
        st.sidebar.warning("⚠️ Please enter your OpenAI API key to proceed.")

# Main page content
st.title("🛡️ PROMPTER")
st.markdown("""
    <div style='text-align: center; font-size: 1.2em; margin-bottom: 2em;'>
        Welcome, operator. Select your tactical module from the sidebar.
    </div>
""", unsafe_allow_html=True)

# Display available modules
st.markdown("""
    ### Available Modules
    
    - **🧠 Prompt Refiner**: Transform and optimize your prompts with military-grade precision
""")