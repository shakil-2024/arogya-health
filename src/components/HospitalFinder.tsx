import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Phone, 
  MapPin, 
  Star, 
  Navigation,
  AlertTriangle,
  Filter,
  Clock
} from 'lucide-react';
import { dummyHospitals, Hospital } from '@/data/dummyHospitals';
import { useVoice } from '@/contexts/VoiceContext';
import { HealthButton } from './HealthButton';

export const HospitalFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const { isVoiceMode, speak } = useVoice();

  const filteredHospitals = useMemo(() => {
    return dummyHospitals.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hospital.specialties.some(specialty => 
                             specialty.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesEmergency = !showEmergencyOnly || hospital.emergency;
      return matchesSearch && matchesEmergency;
    });
  }, [searchTerm, showEmergencyOnly]);

  const handleCall = (hospital: Hospital) => {
    if (isVoiceMode) {
      speak(`कॉल कर रहे हैं ${hospital.name}`, 'hi');
    }
    window.open(`tel:${hospital.phone}`);
  };

  const handleNavigate = (hospital: Hospital) => {
    if (isVoiceMode) {
      speak(`नेविगेट कर रहे हैं ${hospital.name}`, 'hi');
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          Find Hospitals
        </h1>
        <p className="text-muted-foreground">निकटतम अस्पताल खोजें • Find nearby hospitals</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search hospitals or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search hospitals"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <HealthButton
              variant={showEmergencyOnly ? "emergency" : "secondary"}
              size="default"
              icon={<AlertTriangle className="h-4 w-4" />}
              onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
              voiceLabel="Emergency Only Filter"
              className="flex items-center gap-2"
            >
              <span>Emergency Only</span>
            </HealthButton>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {filteredHospitals.length} hospitals found
            </Badge>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredHospitals.length === 0 ? (
          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm">
            <div className="text-muted-foreground">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hospitals found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="p-6 bg-card/50 backdrop-blur-sm shadow-material-md hover:shadow-material-lg transition-all duration-300">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{hospital.name}</h3>
                      {hospital.emergency && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          24/7 Emergency
                        </Badge>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(hospital.rating)}
                      </div>
                      <span className="text-sm font-medium">{hospital.rating}/5</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-primary font-medium">{hospital.distance} away</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{hospital.address}</p>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <HealthButton
                    variant="primary"
                    size="default"
                    icon={<Phone className="h-4 w-4" />}
                    onClick={() => handleCall(hospital)}
                    voiceLabel={`Call ${hospital.name}`}
                    className="flex-1"
                  >
                    <span>Call Hospital</span>
                  </HealthButton>
                  
                  <HealthButton
                    variant="secondary"
                    size="default"
                    icon={<Navigation className="h-4 w-4" />}
                    onClick={() => handleNavigate(hospital)}
                    voiceLabel={`Navigate to ${hospital.name}`}
                    className="flex-1"
                  >
                    <span>Get Directions</span>
                  </HealthButton>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{hospital.emergency ? '24/7 Available' : 'Regular Hours'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{hospital.phone}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {isVoiceMode && (
        <Card className="mt-6 p-4 bg-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-accent animate-pulse" />
            <div>
              <p className="font-medium text-accent">Voice Commands Available</p>
              <p className="text-sm text-muted-foreground">
                Say "Call [Hospital Name]" or "Navigate to [Hospital Name]"
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};