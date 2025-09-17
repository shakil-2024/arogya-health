import React, { createContext, useContext, useState, useEffect } from 'react';

// Major Indian languages with their native scripts
export const SUPPORTED_LANGUAGES = {
  hi: { name: 'हिन्दी', nativeName: 'Hindi', code: 'hi-IN' },
  en: { name: 'English', nativeName: 'English', code: 'en-IN' },
  bn: { name: 'বাংলা', nativeName: 'Bengali', code: 'bn-IN' },
  ta: { name: 'தமிழ்', nativeName: 'Tamil', code: 'ta-IN' },
  te: { name: 'తెలుగు', nativeName: 'Telugu', code: 'te-IN' },
  ml: { name: 'മലയാളം', nativeName: 'Malayalam', code: 'ml-IN' },
  kn: { name: 'ಕನ್ನಡ', nativeName: 'Kannada', code: 'kn-IN' },
  gu: { name: 'ગુજરાતી', nativeName: 'Gujarati', code: 'gu-IN' },
  mr: { name: 'मराठी', nativeName: 'Marathi', code: 'mr-IN' },
  pa: { name: 'ਪੰਜਾਬੀ', nativeName: 'Punjabi', code: 'pa-IN' },
  ur: { name: 'اردو', nativeName: 'Urdu', code: 'ur-IN' },
  or: { name: 'ଓଡ଼ିଆ', nativeName: 'Odia', code: 'or-IN' },
  as: { name: 'অসমীয়া', nativeName: 'Assamese', code: 'as-IN' },
} as const;

// Translation keys for the app
export const TRANSLATIONS = {
  hi: {
    myRecords: 'मेरे रिकॉर्ड',
    addRecord: 'रिकॉर्ड जोड़ें',
    emergency: 'आपातकाल',
    language: 'भाषा',
    healthTimeline: 'स्वास्थ्य समयरेखा',
    diagnosis: 'निदान',
    prescription: 'नुस्खा',
    testReport: 'जांच रिपोर्ट',
    vaccination: 'टीकाकरण',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    details: 'विवरण',
    date: 'तारीख',
    recordType: 'रिकॉर्ड प्रकार',
    voiceMode: 'आवाज मोड',
    touchMode: 'स्पर्श मोड',
  },
  en: {
    myRecords: 'My Records',
    addRecord: 'Add Record',
    emergency: 'Emergency',
    language: 'Language',
    healthTimeline: 'Health Timeline',
    diagnosis: 'Diagnosis',
    prescription: 'Prescription',
    testReport: 'Test Report',
    vaccination: 'Vaccination',
    save: 'Save',
    cancel: 'Cancel',
    details: 'Details',
    date: 'Date',
    recordType: 'Record Type',
    voiceMode: 'Voice Mode',
    touchMode: 'Touch Mode',
  },
  bn: {
    myRecords: 'আমার রেকর্ড',
    addRecord: 'রেকর্ড যোগ করুন',
    emergency: 'জরুরি',
    language: 'ভাষা',
    healthTimeline: 'স্বাস্থ্য সময়রেখা',
    diagnosis: 'নির্ণয়',
    prescription: 'প্রেসক্রিপশন',
    testReport: 'পরীক্ষার রিপোর্ট',
    vaccination: 'টিকাদান',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    details: 'বিস্তারিত',
    date: 'তারিখ',
    recordType: 'রেকর্ড ধরন',
    voiceMode: 'ভয়েস মোড',
    touchMode: 'স্পর্শ মোড',
  },
  ta: {
    myRecords: 'என் பதிவுகள்',
    addRecord: 'பதிவு சேர்க்க',
    emergency: 'அவசரம்',
    language: 'மொழி',
    healthTimeline: 'சுகாதார காலவரிசை',
    diagnosis: 'நோய் கண்டறிதல்',
    prescription: 'மருந்து சீட்டு',
    testReport: 'பரிசோதனை அறிக்கை',
    vaccination: 'தடுப்பூசி',
    save: 'சேமிக்க',
    cancel: 'ரத்து',
    details: 'விவரங்கள்',
    date: 'தேதி',
    recordType: 'பதிவு வகை',
    voiceMode: 'குரல் முறை',
    touchMode: 'தொடுதல் முறை',
  },
  // Additional languages can be added here
} as const;

type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
type TranslationKey = keyof typeof TRANSLATIONS.en;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  currentLanguageInfo: typeof SUPPORTED_LANGUAGES[LanguageCode];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('healthapp-language') as LanguageCode;
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('healthapp-language', lang);
  };

  const t = (key: TranslationKey): string => {
    const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return translations[key] || TRANSLATIONS.en[key] || key;
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES[currentLanguage];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};