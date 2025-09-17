import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { HealthButton } from './HealthButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Calendar as CalendarIcon, 
  Mic, 
  Volume2,
  Stethoscope,
  Pill,
  TestTube,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordFormData {
  type: 'diagnosis' | 'prescription' | 'test' | 'vaccination' | '';
  date: Date | undefined;
  title: string;
  details: string;
  doctor: string;
}

export const AddRecordForm: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguageInfo } = useLanguage();
  const { speak, isVoiceMode, startListening, stopListening, isListening } = useVoice();
  
  const [formData, setFormData] = useState<RecordFormData>({
    type: '',
    date: new Date(),
    title: '',
    details: '',
    doctor: ''
  });
  
  const [activeField, setActiveField] = useState<string | null>(null);

  const recordTypes = [
    { value: 'diagnosis', label: t('diagnosis'), icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'prescription', label: t('prescription'), icon: <Pill className="h-4 w-4" /> },
    { value: 'test', label: 'Test Report', icon: <TestTube className="h-4 w-4" /> },
    { value: 'vaccination', label: t('vaccination'), icon: <Shield className="h-4 w-4" /> },
  ];

  const handleVoiceInput = (field: keyof RecordFormData) => {
    setActiveField(field);
    
    const prompts = {
      title: 'Please say the title of your medical record',
      details: 'Please describe the details of your medical record',
      doctor: 'Please say the doctor\'s name'
    };
    
    if (field in prompts) {
      speak(prompts[field as keyof typeof prompts], currentLanguageInfo.code);
      
      setTimeout(() => {
        startListening((transcript) => {
          setFormData(prev => ({
            ...prev,
            [field]: transcript
          }));
          setActiveField(null);
          speak(`${field} set to: ${transcript}`, currentLanguageInfo.code);
        });
      }, 2000);
    }
  };

  const handleSave = () => {
    if (!formData.type || !formData.title.trim()) {
      speak('Please fill in the record type and title', currentLanguageInfo.code);
      return;
    }

    // Here you would save to your backend/storage
    console.log('Saving record:', formData);
    speak('Record saved successfully', currentLanguageInfo.code);
    navigate('/timeline');
  };

  const handleCancel = () => {
    speak('Cancelled', currentLanguageInfo.code);
    navigate(-1);
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
            onClick={() => navigate(-1)}
            voiceLabel="go back"
            className="rounded-full w-12 h-12 p-0"
          >
            <span className="sr-only">Go Back</span>
          </HealthButton>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('addRecord')}</h1>
            <p className="text-muted-foreground text-sm">Add new health record</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-20">
        {/* Record Type */}
        <Card className="p-6 shadow-material-md border-0 bg-card/70 backdrop-blur-sm">
          <Label className="text-base font-semibold text-foreground mb-4 block">
            {t('recordType')} *
          </Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="h-14 text-base bg-background/50">
              <SelectValue placeholder="Select record type" />
            </SelectTrigger>
            <SelectContent>
              {recordTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="h-12">
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Date */}
        <Card className="p-6 shadow-material-md border-0 bg-card/70 backdrop-blur-sm">
          <Label className="text-base font-semibold text-foreground mb-4 block">
            {t('date')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <HealthButton
                variant="secondary"
                className={cn(
                  "w-full h-14 justify-start text-left font-normal bg-background/50",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </HealthButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </Card>

        {/* Title */}
        <Card className="p-6 shadow-material-md border-0 bg-card/70 backdrop-blur-sm">
          <Label className="text-base font-semibold text-foreground mb-4 block">
            Title *
          </Label>
          <div className="flex gap-2">
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter record title"
              className={cn(
                "h-14 text-base bg-background/50",
                activeField === 'title' && 'ring-2 ring-accent/50 voice-active'
              )}
            />
            {isVoiceMode && (
              <HealthButton
                variant="secondary"
                size="touch"
                icon={isListening && activeField === 'title' ? <Mic className="animate-pulse" /> : <Volume2 />}
                onClick={() => handleVoiceInput('title')}
                className="rounded-full w-14 h-14 p-0 flex-shrink-0"
              >
                <span className="sr-only">Voice Input</span>
              </HealthButton>
            )}
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6 shadow-material-md border-0 bg-card/70 backdrop-blur-sm">
          <Label className="text-base font-semibold text-foreground mb-4 block">
            {t('details')}
          </Label>
          <div className="flex gap-2">
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Enter record details"
              className={cn(
                "min-h-24 text-base bg-background/50 resize-none",
                activeField === 'details' && 'ring-2 ring-accent/50 voice-active'
              )}
            />
            {isVoiceMode && (
              <HealthButton
                variant="secondary"
                size="touch"
                icon={isListening && activeField === 'details' ? <Mic className="animate-pulse" /> : <Volume2 />}
                onClick={() => handleVoiceInput('details')}
                className="rounded-full w-14 h-14 p-0 flex-shrink-0"
              >
                <span className="sr-only">Voice Input</span>
              </HealthButton>
            )}
          </div>
        </Card>

        {/* Doctor */}
        <Card className="p-6 shadow-material-md border-0 bg-card/70 backdrop-blur-sm">
          <Label className="text-base font-semibold text-foreground mb-4 block">
            Doctor/Provider
          </Label>
          <div className="flex gap-2">
            <Input
              value={formData.doctor}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              placeholder="Enter doctor's name"
              className={cn(
                "h-14 text-base bg-background/50",
                activeField === 'doctor' && 'ring-2 ring-accent/50 voice-active'
              )}
            />
            {isVoiceMode && (
              <HealthButton
                variant="secondary"
                size="touch"
                icon={isListening && activeField === 'doctor' ? <Mic className="animate-pulse" /> : <Volume2 />}
                onClick={() => handleVoiceInput('doctor')}
                className="rounded-full w-14 h-14 p-0 flex-shrink-0"
              >
                <span className="sr-only">Voice Input</span>
              </HealthButton>
            )}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-4 right-4 flex gap-4">
        <HealthButton
          variant="secondary"
          size="lg"
          icon={<X />}
          onClick={handleCancel}
          voiceLabel={t('cancel')}
          className="flex-1"
        >
          {t('cancel')}
        </HealthButton>
        <HealthButton
          variant="success"
          size="lg"
          icon={<Save />}
          onClick={handleSave}
          voiceLabel={t('save')}
          className="flex-1"
        >
          {t('save')}
        </HealthButton>
      </div>

      {/* Voice Instructions */}
      {isVoiceMode && (
        <div className="fixed bottom-20 left-4 right-4">
          <Card className="p-3 bg-accent/10 border-accent/20 shadow-material-md">
            <p className="text-xs text-accent text-center">
              Say "save" or "cancel", or tap microphone buttons for voice input
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};