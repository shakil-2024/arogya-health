import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HospitalFinder } from '@/components/HospitalFinder';
import { HealthButton } from '@/components/HealthButton';
import { ArrowLeft } from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <HealthButton
          variant="secondary"
          size="default"
          icon={<ArrowLeft className="h-5 w-5" />}
          onClick={handleBack}
          voiceLabel="Go Back to Home"
          className="rounded-2xl px-4 py-3 shadow-lg"
        >
          <span className="text-sm font-bold">Back to Home</span>
        </HealthButton>
      </div>
      
      <HospitalFinder />
    </div>
  );
};