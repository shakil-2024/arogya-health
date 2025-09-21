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
  Heart,
  ArrowLeft,
  Hospital
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

  const handleHospital = () => {
    if (isVoiceMode) {
      speak('निकटतम अस्पताल से जुड़ रहे हैं।', currentLanguageInfo.code);
    }
    // Here you would implement actual hospital connection functionality
    alert('Connecting to nearest hospital - This would show nearby hospitals');
  };

  const handleGoBack = () => {
    // For home screen, we could go to a different view or just refresh
    window.location.reload();
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center text-white mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <Heart className="h-14 w-14" />
              <h1 className="text-4xl font-bold">Health Records</h1>
            </div>
            <p className="text-lg opacity-90">{currentLanguageInfo.nativeName} • स्वास्थ्य रिकॉर्ड</p>
          </div>
          
          {/* Voice Mode Toggle - Below Heading */}
          <div>
            <HealthButton
              variant={isVoiceMode ? "success" : "secondary"}
              size="lg"
              icon={isVoiceMode ? <Mic className="h-10 w-10" /> : <MicOff className="h-10 w-10" />}
              onClick={toggleVoiceMode}
              voiceLabel={isVoiceMode ? t('touchMode') : t('voiceMode')}
              className={`rounded-3xl px-8 py-6 min-w-[160px] h-24 shadow-2xl border-4 transition-all duration-300 ${
                isVoiceMode 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-300 shadow-red-500/50 animate-pulse ring-4 ring-red-400/30' 
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-300 shadow-red-500/50 hover:shadow-red-500/70 ring-4 ring-red-400/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl font-black tracking-wide">
                  {isVoiceMode ? 'VOICE' : 'VOICE'}
                </span>
                <span className="text-lg font-bold">
                  {isVoiceMode ? 'ON' : 'OFF'}
                </span>
              </div>
            </HealthButton>
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <HealthButton
            variant="secondary"
            size="lg"
            icon={<ArrowLeft className="h-8 w-8" />}
            onClick={handleGoBack}
            voiceLabel="Go Back"
            className="rounded-2xl px-4 py-4 h-16 shadow-lg"
          >
            <span className="text-sm font-bold">Back</span>
          </HealthButton>
        </div>
      </div>

      <div className="p-4">
        {/* Main Action Cards - Larger Buttons */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* My Records */}
          <Card className="p-8 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="primary"
              size="lg"
              icon={<FileText className="h-12 w-12" />}
              onClick={handleMyRecords}
              voiceLabel={t('myRecords')}
              className="w-full justify-start text-left h-24"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold">{t('myRecords')}</span>
                <span className="text-lg opacity-80 font-normal mt-1">अपनी स्वास्थ्य समयरेखा देखें</span>
              </div>
            </HealthButton>
          </Card>

          {/* Add Record */}
          <Card className="p-8 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="secondary"
              size="lg"
              icon={<Plus className="h-12 w-12" />}
              onClick={handleAddRecord}
              voiceLabel={t('addRecord')}
              className="w-full justify-start text-left h-24"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold">{t('addRecord')}</span>
                <span className="text-lg opacity-80 font-normal mt-1">नया मेडिकल रिकॉर्ड जोड़ें</span>
              </div>
            </HealthButton>
          </Card>
        </div>

        {/* Beginner Instructions */}
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold text-foreground mb-3">Quick Actions</h2>
          <p className="text-lg text-muted-foreground">
            Choose what you want to do. {isVoiceMode ? 'You can speak your choice or tap the buttons.' : 'Tap any button below to get started.'}
          </p>
        </div>

        {/* Emergency and Language - Vertical Layout */}
        <div className="grid grid-cols-1 gap-6 mb-10">
          {/* Emergency Button */}
          <Card className="p-8 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="emergency"
              size="lg"
              icon={<AlertTriangle className="h-12 w-12" />}
              onClick={handleEmergency}
              voiceLabel={t('emergency')}
              className="w-full justify-start text-left h-24"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold">{t('emergency')}</span>
                <span className="text-lg opacity-90 font-normal mt-1">तुरंत मदद के लिए • For immediate help</span>
              </div>
            </HealthButton>
          </Card>

          {/* Hospital Connect Button */}
          <Card className="p-8 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="emergency"
              size="lg"
              icon={<Hospital className="h-12 w-12" />}
              onClick={handleHospital}
              voiceLabel="Connect to Hospital"
              className="w-full justify-start text-left h-24"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold">Connect to Hospital</span>
                <span className="text-lg opacity-90 font-normal mt-1">निकटतम अस्पताल • Find nearest hospital</span>
              </div>
            </HealthButton>
          </Card>

          {/* Language Button */}
          <Card className="p-8 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
            <HealthButton
              variant="primary"
              size="lg"
              icon={<Globe className="h-12 w-12" />}
              onClick={handleLanguage}
              voiceLabel={t('language')}
              className="w-full justify-start text-left h-24"
            >
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold">{t('language')}</span>
                <span className="text-lg opacity-90 font-normal mt-1">भाषा बदलें • Change language</span>
              </div>
            </HealthButton>
          </Card>
        </div>

        {/* Voice Instructions */}
        {isVoiceMode && (
          <Card className="p-6 bg-accent/10 border-accent/20 shadow-material-md">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-accent animate-pulse" />
              <div>
                <p className="text-lg font-medium text-accent">आवाज मोड सक्रिय • Voice Mode Active</p>
                <p className="text-base text-muted-foreground">
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