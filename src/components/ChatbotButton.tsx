import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoice } from '@/contexts/VoiceContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { speak, isVoiceMode } = useVoice();
  const { currentLanguage, currentLanguageInfo, t } = useLanguage();
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [currentLanguage]);

  // Set initial message based on language
  useEffect(() => {
    const initialMessage = currentLanguage === 'hi' 
      ? 'नमस्ते! मैं अस्पताल खोजने, अपॉइंटमेंट बुक करने और स्वास्थ्य प्रश्नों में आपकी मदद कर सकता हूं। मैं आपकी कैसे सहायता कर सकता हूं?'
      : 'Hello! I can help you find hospitals, book appointments, and answer health questions. How can I assist you?';
    
    setMessages([{ text: initialMessage, sender: 'bot' }]);
  }, [currentLanguage]);

  const getMultilingualResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const isHindi = currentLanguage === 'hi';
    
    if (lowerMessage.includes('hospital') || lowerMessage.includes('अस्पताल') || lowerMessage.includes('doctor') || lowerMessage.includes('डॉक्टर')) {
      return isHindi 
        ? 'मैं आपको नजदीकी अस्पताल खोजने में मदद कर सकता हूं। आपके स्थान के आधार पर, मैं सिटी जनरल अस्पताल या अपोलो मेडिकल सेंटर की सिफारिश करता हूं। क्या आप उनका संपर्क विवरण चाहते हैं?'
        : 'I can help you find nearby hospitals. Based on your location, I recommend City General Hospital or Apollo Medical Center. Would you like their contact details?';
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('अपॉइंटमेंट') || lowerMessage.includes('book') || lowerMessage.includes('बुक')) {
      return isHindi
        ? 'अपॉइंटमेंट बुक करने के लिए, मैं आपको इन अस्पतालों से जोड़ सकता हूं: 1) सिटी जनरल अस्पताल - आज दोपहर 2 बजे, शाम 4 बजे 2) अपोलो मेडिकल सेंटर - कल सुबह 10 बजे, दोपहर 3 बजे। आप कौन सा पसंद करेंगे?'
        : 'To book an appointment, I can connect you with these hospitals: 1) City General Hospital - Available slots today at 2 PM, 4 PM 2) Apollo Medical Center - Tomorrow at 10 AM, 3 PM. Which would you prefer?';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('आपातकाल') || lowerMessage.includes('इमरजेंसी')) {
      return isHindi
        ? 'आपातकाल के लिए तुरंत 102 पर कॉल करें। निकटतम आपातकालीन अस्पताल सिटी जनरल अस्पताल है - 2 मिनट दूर। क्या मैं आपके लिए उन्हें कॉल करूं?'
        : 'For emergencies, call 102 immediately. The nearest emergency hospital is City General Hospital - 2 minutes away. Should I call them for you?';
    } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('टीका') || lowerMessage.includes('vaccination') || lowerMessage.includes('वैक्सीनेशन')) {
      return isHindi
        ? 'आपका अगला टीकाकरण 5 दिन में है - COVID-19 बूस्टर। मैं इसे सिटी मेडिकल सेंटर में शेड्यूल कर सकता हूं। क्या आप चाहते हैं कि मैं अपॉइंटमेंट बुक करूं?'
        : 'Your next vaccination is due in 5 days - COVID-19 booster. I can schedule it at City Medical Center. Would you like me to book an appointment?';
    } else {
      return isHindi
        ? 'मैं समझता हूं कि आपको मदद चाहिए। मैं इसमें सहायता कर सकता हूं: 1) अस्पताल खोजना 2) अपॉइंटमेंट बुकिंग 3) आपातकालीन संपर्क 4) टीकाकरण रिमाइंडर। आप क्या करना चाहते हैं?'
        : 'I understand you need help. I can assist with: 1) Finding hospitals 2) Booking appointments 3) Emergency contacts 4) Vaccination reminders. What would you like to do?';
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setMessage('');

    // Generate multilingual response
    setTimeout(() => {
      const botResponse = getMultilingualResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      
      if (isVoiceMode) {
        speak(botResponse, currentLanguageInfo.code);
      }
    }, 1000);
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white border-4 border-white/20"
          size="lg"
        >
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageCircle className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-foreground">
                {currentLanguage === 'hi' ? 'स्वास्थ्य सहायक' : 'Health Assistant'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{msg.text}</span>
                    {msg.sender === 'bot' && isVoiceMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        onClick={() => speak(msg.text, currentLanguageInfo.code)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage === 'hi' 
                  ? 'अस्पताल, अपॉइंटमेंट के बारे में पूछें...' 
                  : 'Ask about hospitals, appointments...'
                }
                className="flex-1"
              />
              {recognition && (
                <Button 
                  onClick={isListening ? stopListening : startListening}
                  size="sm" 
                  variant={isListening ? "destructive" : "outline"}
                  className="px-3"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button onClick={handleSendMessage} size="sm" className="px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};