import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceContextType {
  isVoiceMode: boolean;
  toggleVoiceMode: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  speak: (text: string, language?: string) => void;
  startListening: (callback?: (transcript: string) => void) => void;
  stopListening: () => void;
  voiceCommands: Map<string, () => void>;
  registerVoiceCommand: (command: string, action: () => void) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceCommands] = useState(new Map<string, () => void>());
  const [recognition, setRecognition] = useState<any | null>(null);
  const [synthesis] = useState(window.speechSynthesis);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'hi-IN'; // Default to Hindi
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      speak('Voice mode activated. You can now use voice commands.');
    } else {
      speak('Voice mode deactivated. Touch mode enabled.');
    }
  };

  const speak = (text: string, language: string = 'hi-IN') => {
    if (synthesis) {
      // Cancel any ongoing speech
      synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.speak(utterance);
    }
  };

  const startListening = (callback?: (transcript: string) => void) => {
    if (recognition && !isListening) {
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Check for registered voice commands
        for (const [command, action] of voiceCommands) {
          if (transcript.includes(command.toLowerCase())) {
            action();
            return;
          }
        }
        
        // If no command matched, call the callback with transcript
        if (callback) {
          callback(transcript);
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const registerVoiceCommand = (command: string, action: () => void) => {
    voiceCommands.set(command, action);
  };

  return (
    <VoiceContext.Provider
      value={{
        isVoiceMode,
        toggleVoiceMode,
        isListening,
        isSpeaking,
        speak,
        startListening,
        stopListening,
        voiceCommands,
        registerVoiceCommand,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

// Add speech recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}