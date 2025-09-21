export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  specialties: string[];
  rating: number;
  distance: string;
  emergency: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
}

export const dummyHospitals: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospital",
    address: "21, Greams Lane, Off Greams Road, Chennai - 600006",
    phone: "+91-44-2829 3333",
    specialties: ["Cardiology", "Oncology", "Neurology", "Emergency Care"],
    rating: 4.5,
    distance: "2.3 km",
    emergency: true,
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: "2",
    name: "Fortis Hospital",
    address: "14, Ring Road, Lajpat Nagar IV, New Delhi - 110024",
    phone: "+91-11-4777 7777",
    specialties: ["Orthopedics", "Gastroenterology", "Pediatrics"],
    rating: 4.3,
    distance: "3.8 km",
    emergency: true,
    coordinates: { lat: 28.5355, lng: 77.2431 }
  },
  {
    id: "3",
    name: "Max Healthcare",
    address: "1, Press Enclave Road, Saket, New Delhi - 110017",
    phone: "+91-11-2651 5050",
    specialties: ["Cardiac Surgery", "Nephrology", "Pulmonology"],
    rating: 4.4,
    distance: "1.7 km",
    emergency: true,
    coordinates: { lat: 28.5244, lng: 77.2066 }
  },
  {
    id: "4",
    name: "Manipal Hospital",
    address: "98, HAL Airport Road, Bangalore - 560017",
    phone: "+91-80-2502 4444",
    specialties: ["Neurosurgery", "Urology", "Gynecology"],
    rating: 4.2,
    distance: "5.1 km",
    emergency: false,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: "5",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Rao Saheb Achutrao Patwardhan Marg, Mumbai - 400053",
    phone: "+91-22-4269 6969",
    specialties: ["Transplant Surgery", "Oncology", "Emergency Care"],
    rating: 4.6,
    distance: "4.2 km",
    emergency: true,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: "6",
    name: "AIIMS Hospital",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029",
    phone: "+91-11-2658 8500",
    specialties: ["All Specialties", "Research", "Emergency Care"],
    rating: 4.7,
    distance: "6.8 km",
    emergency: true,
    coordinates: { lat: 28.5672, lng: 77.2100 }
  },
  {
    id: "7",
    name: "Medanta Hospital",
    address: "Sector 38, Gurgaon, Haryana - 122001",
    phone: "+91-124-4141 414",
    specialties: ["Heart Surgery", "Liver Transplant", "Robotics Surgery"],
    rating: 4.5,
    distance: "12.3 km",
    emergency: true,
    coordinates: { lat: 28.4089, lng: 77.0657 }
  },
  {
    id: "8",
    name: "Narayana Health",
    address: "258/A, Bommasandra Industrial Area, Bangalore - 560099",
    phone: "+91-80-7122 2222",
    specialties: ["Pediatric Surgery", "Cardiology", "Oncology"],
    rating: 4.1,
    distance: "8.9 km",
    emergency: false,
    coordinates: { lat: 12.8056, lng: 77.6081 }
  }
];