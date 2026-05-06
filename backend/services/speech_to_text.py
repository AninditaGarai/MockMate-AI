"""
Speech-to-Text service using browser speech recognition or Google Speech-to-Text API
"""

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio file to text"""
    
    try:
        # Try using speech_recognition library
        import speech_recognition as sr
        
        recognizer = sr.Recognizer()
        
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
        
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            return f"Error with speech recognition service: {e}"
    
    except ImportError:
        # Fallback: return placeholder
        return "Speech-to-text library not installed. Please install: pip install SpeechRecognition"
    except Exception as e:
        return f"Error transcribing audio: {e}"
