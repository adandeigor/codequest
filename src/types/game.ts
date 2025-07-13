export interface Universe {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  category: 'web' | 'mobile' | 'data' | 'ai' | 'systems' | 'game';
  totalLevels: number;
}

export interface Question {
  id: string;
  universeId: string;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
}

export interface Player {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt: Date;
  lastActive: Date;
}

export interface PlayerStats {
  playerId: string;
  universeId: string;
  level: number;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  completedLevels: number[];
  badges: Badge[];
  certificates: Certificate[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface Certificate {
  id: string;
  name: string;
  universeId: string;
  level: string;
  issuedAt: Date;
  verificationCode: string;
}

export interface GameSession {
  id: string;
  mode: 'solo' | 'duel' | 'league' | 'tournament';
  universeId: string;
  difficulty: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  startTime: Date;
  endTime?: Date;
  playerId: string;
  opponentId?: string;
}

export interface League {
  id: string;
  universeId: string;
  name: string;
  season: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  standings: LeagueStanding[];
}

export interface LeagueStanding {
  playerId: string;
  points: number;
  wins: number;
  losses: number;
  rank: number;
}

export interface Tournament {
  id: string;
  name: string;
  universeId: string;
  bracket: TournamentMatch[];
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  winnerId?: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  score1?: number;
  score2?: number;
}