import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { HealthButton } from './HealthButton';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Stethoscope, 
  Pill, 
  TestTube, 
  Shield,
  Volume2,
  Clock
} from 'lucide-react';

interface HealthRecord {
  id: string;
  type: 'diagnosis' | 'prescription' | 'test' | 'vaccination';
  title: string;
  date: string;
  details: string;
  doctor?: string;
}

// Mock data for demonstration
const mockRecords: HealthRecord[] = [
  {
    id: '1',
    type: 'diagnosis',
    title: 'Annual Health Checkup',
    date: '2024-09-15',
    details: 'Regular health checkup. Blood pressure normal, weight stable.',
    doctor: 'Dr. Sharma'
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Vitamin D Supplements',
    date: '2024-09-10',
    details: 'Vitamin D3 1000 IU daily for 3 months',
    doctor: 'Dr. Patel'
  },
  {
    id: '3',
    type: 'test',
    title: 'Blood Test Report',
    date: '2024-09-01',
    details: 'Hemoglobin: 12.5 g/dL, Blood sugar: 95 mg/dL (Normal)',
    doctor: 'Dr. Kumar'
  },
  {
    id: '4',
    type: 'vaccination',
    title: 'COVID-19 Booster',
    date: '2024-08-15',
    details: 'Third dose of COVID-19 vaccine administered',
    doctor: 'Nurse Johnson'
  }
];

export const HealthTimeline: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguageInfo } = useLanguage();
  const { speak, isVoiceMode } = useVoice();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const getRecordIcon = (type: HealthRecord['type']) => {
    switch (type) {
      case 'diagnosis':
        return <Stethoscope className="h-5 w-5" />;
      case 'prescription':
        return <Pill className="h-5 w-5" />;
      case 'test':
        return <TestTube className="h-5 w-5" />;
      case 'vaccination':
        return <Shield className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getRecordColor = (type: HealthRecord['type']) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-primary text-primary-foreground';
      case 'prescription':
        return 'bg-secondary text-secondary-foreground';
      case 'test':
        return 'bg-accent text-accent-foreground';
      case 'vaccination':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleReadRecord = (record: HealthRecord) => {
    const text = `${record.title}. Date: ${record.date}. ${record.details}. ${record.doctor ? `Doctor: ${record.doctor}` : ''}`;
    speak(text, currentLanguageInfo.code);
    setSelectedRecord(record.id);
    setTimeout(() => setSelectedRecord(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-8">
        <div className="flex items-center gap-3">
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
            <h1 className="text-2xl font-bold text-foreground">{t('healthTimeline')}</h1>
            <p className="text-muted-foreground text-sm">{mockRecords.length} records</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6 mb-20">
        {mockRecords.map((record, index) => (
          <div key={record.id} className="relative">
            {/* Timeline Line */}
            {index !== mockRecords.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border"></div>
            )}
            
            {/* Record Card */}
            <Card className={`p-4 shadow-material-md border-0 bg-card/70 backdrop-blur-sm transition-smooth ${
              selectedRecord === record.id ? 'ring-2 ring-primary/50 shadow-glow' : ''
            }`}>
              <div className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getRecordColor(record.type)} shadow-material-sm`}>
                  {getRecordIcon(record.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{record.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(record.date)}</span>
                        {record.doctor && (
                          <>
                            <span>•</span>
                            <span>{record.doctor}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Voice Read Button */}
                    <HealthButton
                      variant="secondary"
                      size="touch"
                      icon={<Volume2 />}
                      onClick={() => handleReadRecord(record)}
                      voiceLabel={`read ${record.title}`}
                      className="rounded-full w-10 h-10 p-0 ml-2 flex-shrink-0"
                    >
                      <span className="sr-only">Read Record</span>
                    </HealthButton>
                  </div>
                  
                  <p className="text-foreground mt-3 text-sm leading-relaxed">{record.details}</p>
                  
                  {/* Record Type Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-3 ${getRecordColor(record.type)}`}>
                    {getRecordIcon(record.type)}
                    <span className="capitalize">{t(record.type as keyof typeof t)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6">
        <HealthButton
          variant="primary"
          size="lg"
          icon={<Plus />}
          onClick={() => navigate('/add-record')}
          voiceLabel={t('addRecord')}
          className="rounded-full w-16 h-16 p-0 shadow-material-lg"
        >
          <span className="sr-only">{t('addRecord')}</span>
        </HealthButton>
      </div>

      {/* Voice Instructions */}
      {isVoiceMode && (
        <div className="fixed bottom-20 left-4 right-4">
          <Card className="p-3 bg-accent/10 border-accent/20 shadow-material-md">
            <p className="text-xs text-accent text-center">
              Say "read [record name]" to hear details or "add record" to create new
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};