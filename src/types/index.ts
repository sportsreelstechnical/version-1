export interface User {
  id: string;
  role: 'club' | 'scout';
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Club {
  id: string;
  userId: string;
  clubName: string;
  website?: string;
  division: string;
  league: string;
  planType: 'basic' | 'standard' | 'premium';
}

export interface Scout {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fifaLicenceNumber: string;
  country?: string;
  preferredLeague?: string;
}

export interface Player {
  id: string;
  clubId: string;
  fifaId: string;
  name: string;
  position: string;
  age: number;
  height: number;
  weight: number;
  jerseyNumber: number;
  photo?: string;
  status: 'active' | 'injured' | 'transferred' | 'retired';
  createdAt: string;
}

export interface Match {
  id: string;
  clubId: string;
  videoUrl?: string;
  matchDate: string;
  opponent: string;
  playerIds: string[];
  analyzed: boolean;
}

export interface AIAnalysis {
  id: string;
  matchId: string;
  playerId: string;
  goals: number;
  assists: number;
  heatMapUrl?: string;
  distance: number;
  speed: number;
  passes: number;
  rating: number;
  suggestions: string[];
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  playerId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'basic' | 'standard' | 'premium' | 'scout';
  price: number;
  playerLimit?: number;
  features: string[];
  active: boolean;
}