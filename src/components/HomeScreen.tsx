import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { HealthButton } from './HealthButton';
import { Card } from '@/components/ui/card';
import healthHero from '@/assets/health-hero.jpg';
import { 
  FileText, 
  Plus, 
  AlertTriangle, 
  Globe, 
  Mic, 
  MicOff,
  Activity,
  Heart
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguageInfo } = useLanguage();
  const { isVoiceMode, toggleVoiceMode, speak } = useVoice();

  React.useEffect(() => {
    if (isVoiceMode) {
      speak(`नमस्ते! Health Records में आपका स्वागत है। वर्तमान भाषा: ${currentLanguageInfo.nativeName}`, currentLanguageInfo.code);
    }
  }, [isVoiceMode, currentLanguageInfo, speak]);

  const handleMyRecords = () => {
    navigate('/timeline');
  };

  const handleAddRecord = () => {
    navigate('/add-record');
  };

  const handleEmergency = () => {
    if (isVoiceMode) {
      speak('आपातकाल मोड सक्रिय। आपातकालीन सेवाओं को कॉल कर रहे हैं।', currentLanguageInfo.code);
    }
    // Here you would implement actual emergency functionality
    alert('Emergency SOS - This would call emergency services');
  };

  const handleLanguage = () => {
    navigate('/language');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={healthHero} 
          alt="Health Records App - Medical care for everyone"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Health Records</h1>
            </div>
            <p className="text-sm opacity-90">{currentLanguageInfo.nativeName} • स्वास्थ्य रिकॉर्ड</p>
          </div>
        </div>
        
        {/* Voice Mode Toggle - Large & Unique */}
        <div className="absolute top-4 right-4">
          <HealthButton
            variant={isVoiceMode ? "success" : "secondary"}
            size="lg"
            icon={isVoiceMode ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
            onClick={toggleVoiceMode}
            voiceLabel={isVoiceMode ? t('touchMode') : t('voiceMode')}
            className={`rounded-2xl px-6 py-4 min-w-[140px] h-20 shadow-material-lg border-2 transition-all duration-300 ${
              isVoiceMode 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-500/30 animate-pulse' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 shadow-blue-500/30 hover:shadow-blue-500/50'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold">
                {isVoiceMode ? 'VOICE' : 'VOICE'}
              </span>
              <span className="text-xs font-medium opacity-90">
                {isVoiceMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </HealthButton>
        </div>
      </div>

      <div className="p-4">
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* My Records */}
          <Card className="p-6 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="primary"
              size="lg"
              icon={<FileText />}
              onClick={handleMyRecords}
              voiceLabel={t('myRecords')}
              className="w-full justify-start text-left"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">{t('myRecords')}</span>
                <span className="text-sm opacity-80 font-normal">अपनी स्वास्थ्य समयरेखा देखें</span>
              </div>
            </HealthButton>
          </Card>

          {/* Add Record */}
          <Card className="p-6 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="secondary"
              size="lg"
              icon={<Plus />}
              onClick={handleAddRecord}
              voiceLabel={t('addRecord')}
              className="w-full justify-start text-left"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">{t('addRecord')}</span>
                <span className="text-sm opacity-80 font-normal">नया मेडिकल रिकॉर्ड जोड़ें</span>
              </div>
            </HealthButton>
          </Card>
        </div>

        {/* Beginner Instructions */}
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold text-foreground mb-2">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Choose what you want to do. {isVoiceMode ? 'You can speak your choice or tap the buttons.' : 'Tap any button below to get started.'}
          </p>
        </div>

        {/* Emergency and Language - Vertical Layout */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Emergency Button */}
          <Card className="p-6 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="emergency"
              size="lg"
              icon={<AlertTriangle />}
              onClick={handleEmergency}
              voiceLabel={t('emergency')}
              className="w-full justify-start text-left h-16"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">{t('emergency')}</span>
                <span className="text-sm opacity-90 font-normal">तुरंत मदद के लिए • For immediate help</span>
              </div>
            </HealthButton>
          </Card>

          {/* Language Button */}
          <Card className="p-6 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="primary"
              size="lg"
              icon={<Globe />}
              onClick={handleLanguage}
              voiceLabel={t('language')}
              className="w-full justify-start text-left h-16"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">{t('language')}</span>
                <span className="text-sm opacity-90 font-normal">भाषा बदलें • Change language</span>
              </div>
            </HealthButton>
          </Card>
        </div>

        {/* Voice Instructions */}
        {isVoiceMode && (
          <Card className="p-4 bg-accent/10 border-accent/20 shadow-material-md">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-accent animate-pulse" />
              <div>
                <p className="text-sm font-medium text-accent">आवाज मोड सक्रिय • Voice Mode Active</p>
                <p className="text-xs text-muted-foreground">
                  कहें: "मेरे रिकॉर्ड", "रिकॉर्ड जोड़ें", "आपातकाल", या "भाषा"
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};