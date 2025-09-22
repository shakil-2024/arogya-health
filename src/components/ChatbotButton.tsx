import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoice } from '@/contexts/VoiceContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([
    { text: 'Hello! I can help you find hospitals, book appointments, and answer health questions. How can I assist you?', sender: 'bot' }
  ]);
  const { speak, isVoiceMode } = useVoice();
  const { currentLanguageInfo } = useLanguage();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setMessage('');

    // Simple bot responses based on keywords
    setTimeout(() => {
      let botResponse = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('hospital') || lowerMessage.includes('doctor')) {
        botResponse = 'I can help you find nearby hospitals. Based on your location, I recommend City General Hospital or Apollo Medical Center. Would you like their contact details?';
      } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
        botResponse = 'To book an appointment, I can connect you with these hospitals: 1) City General Hospital - Available slots today at 2 PM, 4 PM 2) Apollo Medical Center - Tomorrow at 10 AM, 3 PM. Which would you prefer?';
      } else if (lowerMessage.includes('emergency')) {
        botResponse = 'For emergencies, call 102 immediately. The nearest emergency hospital is City General Hospital - 2 minutes away. Should I call them for you?';
      } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('vaccination')) {
        botResponse = 'Your next vaccination is due in 5 days - COVID-19 booster. I can schedule it at City Medical Center. Would you like me to book an appointment?';
      } else {
        botResponse = 'I understand you need help. I can assist with: 1) Finding hospitals 2) Booking appointments 3) Emergency contacts 4) Vaccination reminders. What would you like to do?';
      }
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      
      if (isVoiceMode) {
        speak(botResponse, currentLanguageInfo.code);
      }
    }, 1000);
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
              <h3 className="text-lg font-bold text-foreground">Health Assistant</h3>
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
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about hospitals, appointments..."
                className="flex-1"
              />
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