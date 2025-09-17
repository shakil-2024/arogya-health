import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { HealthButton } from './HealthButton';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check, Volume2 } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { speak } = useVoice();

  const handleLanguageSelect = (langCode: keyof typeof SUPPORTED_LANGUAGES) => {
    setLanguage(langCode);
    const selectedLang = SUPPORTED_LANGUAGES[langCode];
    speak(`Language changed to ${selectedLang.nativeName}`, selectedLang.code);
    setTimeout(() => navigate('/'), 1500);
  };

  const handleTestVoice = (langCode: keyof typeof SUPPORTED_LANGUAGES) => {
    const lang = SUPPORTED_LANGUAGES[langCode];
    speak(`This is ${lang.nativeName} language`, lang.code);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-8">
        <HealthButton
          variant="secondary"
          size="touch"
          icon={<ArrowLeft />}
          onClick={() => navigate('/')}
          voiceLabel="go back"
          className="rounded-full w-12 h-12 p-0"
        >
          <span className="sr-only">Go Back</span>
        </HealthButton>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('language')}</h1>
          <p className="text-muted-foreground text-sm">Choose your preferred language</p>
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
          <Card 
            key={code}
            className={`p-4 shadow-material-md border-0 bg-card/70 backdrop-blur-sm transition-smooth ${
              currentLanguage === code ? 'ring-2 ring-primary/50 bg-primary/5' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLanguageSelect(code as keyof typeof SUPPORTED_LANGUAGES)}
                className="flex items-center gap-4 flex-1 text-left p-2 rounded-lg hover:bg-muted/30 transition-smooth"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-foreground">{lang.name}</span>
                    {currentLanguage === code && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{lang.nativeName}</p>
                </div>
              </button>
              
              {/* Test Voice Button */}
              <HealthButton
                variant="secondary"
                size="touch"
                icon={<Volume2 />}
                onClick={() => handleTestVoice(code as keyof typeof SUPPORTED_LANGUAGES)}
                className="rounded-full w-12 h-12 p-0 ml-2 flex-shrink-0"
              >
                <span className="sr-only">Test Voice</span>
              </HealthButton>
            </div>
          </Card>
        ))}
      </div>

      {/* Current Selection */}
      <Card className="p-4 bg-primary/10 border-primary/20 shadow-material-md">
        <div className="flex items-center gap-3">
          <Check className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-primary">Current Language</p>
            <p className="text-sm text-foreground">
              {SUPPORTED_LANGUAGES[currentLanguage].name} ({SUPPORTED_LANGUAGES[currentLanguage].nativeName})
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};