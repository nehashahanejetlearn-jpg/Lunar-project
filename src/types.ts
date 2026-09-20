export type TabType = 
  | 'home' 
  | 'map' 
  | 'mission' 
  | 'lab' 
  | 'rover' 
  | 'resources' 
  | 'phases' 
  | 'timeline' 
  | 'quiz';

export type LunarFeatureType = 'Crater' | 'Mare' | 'Mountain' | 'Landing Site' | 'Polar Region';

export interface LunarLocation {
  id: string;
  name: string;
  type: LunarFeatureType;
  coordinates: string;
  lat: number;
  lng: number; // -180 to 180 or normalized for map
  diameter?: string;
  depth?: string;
  age?: string;
  description: string;
  formation: string;
  scientificImportance: string;
  historicalMission?: string;
  imageAccent?: string;
}

export interface Spacecraft {
  id: string;
  name: string;
  crewCapacity: number;
  propulsion: string;
  payloadCapacity: string;
  fuelEfficiency: number; // multiplier
  reliability: number; // percentage
  description: string;
}

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  difficulty: 'Standard' | 'Advanced' | 'Extreme';
}

export interface MissionSetup {
  spacecraftId: string;
  landingLocationId: string;
  durationDays: number;
  selectedObjectives: string[];
}

export interface MissionTelemetry {
  phase: 'Pre-Launch' | 'Earth Orbit' | 'Trans-Lunar Injection' | 'Lunar Orbit' | 'Descent & Landing' | 'Surface Operations' | 'Mission Complete' | 'Aborted';
  progressPercent: number;
  fuelRemainingKg: number;
  speedKmH: number;
  distanceKm: number;
  oxygenLevelPercent: number;
  cabinTempCelsius: number;
  commStatus: 'Nominal' | 'Slight Lag' | 'Deep Space Network Active' | 'Far-Side Blackout';
  logs: Array<{ time: string; text: string; type: 'info' | 'warn' | 'success' }>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xp?: number;
}

export interface ResourceInfo {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  whatItIs: string;
  whereFound: string;
  whyImportant: string;
  futureApplications: string;
  abundanceEstimate: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  tag: string;
  description: string;
  significance: string;
  countryOrOrg: string;
}
