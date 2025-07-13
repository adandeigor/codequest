import { Player, PlayerStats, GameSession, Badge, Certificate, Universe, Question, League, Tournament } from '@/types/game';
import { universes } from '@/data/universes';
import { questions, generateAdditionalQuestions } from '@/data/questions';

class GameDatabase {
  private players: Map<string, Player> = new Map();
  private playerStats: Map<string, PlayerStats[]> = new Map();
  private sessions: Map<string, GameSession> = new Map();
  private leagues: Map<string, League> = new Map();
  private tournaments: Map<string, Tournament> = new Map();

  constructor() {
    this.loadFromLocalStorage();
    this.initializeDefaults();
  }

  // Player Management
  createPlayer(name: string, email?: string): Player {
    const player: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      totalScore: 0,
      createdAt: new Date(),
      lastActive: new Date()
    };

    this.players.set(player.id, player);
    this.initializePlayerStats(player.id);
    this.saveToLocalStorage();
    return player;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  updatePlayer(id: string, updates: Partial<Player>): void {
    const player = this.players.get(id);
    if (player) {
      Object.assign(player, updates, { lastActive: new Date() });
      this.saveToLocalStorage();
    }
  }

  // Player Stats Management
  private initializePlayerStats(playerId: string): void {
    const stats: PlayerStats[] = universes.map(universe => ({
      playerId,
      universeId: universe.id,
      level: 1,
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      completedLevels: [],
      badges: [],
      certificates: []
    }));

    this.playerStats.set(playerId, stats);
  }

  getPlayerStats(playerId: string, universeId?: string): PlayerStats[] {
    const stats = this.playerStats.get(playerId) || [];
    return universeId ? stats.filter(s => s.universeId === universeId) : stats;
  }

  updatePlayerStats(playerId: string, universeId: string, updates: Partial<PlayerStats>): void {
    const playerStats = this.playerStats.get(playerId);
    if (playerStats) {
      const statIndex = playerStats.findIndex(s => s.universeId === universeId);
      if (statIndex >= 0) {
        Object.assign(playerStats[statIndex], updates);
        this.saveToLocalStorage();
      }
    }
  }

  // Questions Management
  getQuestions(universeId: string, level: number, limit: number = 20): Question[] {
    let universeQuestions = questions.filter(q => q.universeId === universeId && q.level === level);
    
    // Generate additional questions if not enough
    if (universeQuestions.length < limit) {
      const additionalQuestions = generateAdditionalQuestions(universeId, level);
      universeQuestions = [...universeQuestions, ...additionalQuestions];
    }

    // Shuffle and limit
    const shuffled = universeQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  getUniverses(): Universe[] {
    return universes;
  }

  getUniversesByCategory(category: string): Universe[] {
    return universes.filter(u => u.category === category);
  }

  // Game Session Management
  createGameSession(playerId: string, universeId: string, mode: GameSession['mode'], difficulty: string): GameSession {
    const level = this.getPlayerStats(playerId, universeId)[0]?.level || 1;
    const sessionQuestions = this.getQuestions(universeId, level);

    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      universeId,
      difficulty,
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      score: 0,
      startTime: new Date(),
      playerId
    };

    this.sessions.set(session.id, session);
    return session;
  }

  getGameSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  updateGameSession(sessionId: string, updates: Partial<GameSession>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.saveToLocalStorage();
    }
  }

  completeGameSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      
      // Update player stats
      const stats = this.getPlayerStats(session.playerId, session.universeId)[0];
      if (stats) {
        const correctAnswers = session.score;
        const totalQuestions = session.questions.length;
        
        this.updatePlayerStats(session.playerId, session.universeId, {
          questionsAnswered: stats.questionsAnswered + totalQuestions,
          correctAnswers: stats.correctAnswers + correctAnswers,
          score: stats.score + session.score
        });

        // Check for level completion and badges
        this.checkBadges(session.playerId, session.universeId, session);
      }

      this.saveToLocalStorage();
    }
  }

  // Badge and Certificate System
  private checkBadges(playerId: string, universeId: string, session: GameSession): void {
    const stats = this.getPlayerStats(playerId, universeId)[0];
    if (!stats) return;

    const newBadges: Badge[] = [];

    // Perfect score badge
    if (session.score === session.questions.length) {
      newBadges.push({
        id: `perfect_${universeId}_${Date.now()}`,
        name: 'Score Parfait',
        description: `Score parfait en ${universeId}`,
        icon: '🎯',
        rarity: 'rare',
        unlockedAt: new Date()
      });
    }

    // Quick completion badge
    const timeTaken = (session.endTime!.getTime() - session.startTime.getTime()) / 1000;
    if (timeTaken < 60) {
      newBadges.push({
        id: `speed_${universeId}_${Date.now()}`,
        name: 'Vitesse Éclair',
        description: 'Complété en moins d\'une minute',
        icon: '⚡',
        rarity: 'epic',
        unlockedAt: new Date()
      });
    }

    // Add badges to player stats
    if (newBadges.length > 0) {
      stats.badges.push(...newBadges);
      this.updatePlayerStats(playerId, universeId, { badges: stats.badges });
    }
  }

  // League Management
  createLeague(universeId: string, season: number): League {
    const league: League = {
      id: `league_${universeId}_${season}`,
      universeId,
      name: `${universes.find(u => u.id === universeId)?.name} League S${season}`,
      season,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      participants: [],
      standings: []
    };

    this.leagues.set(league.id, league);
    return league;
  }

  getLeagues(universeId?: string): League[] {
    const allLeagues = Array.from(this.leagues.values());
    return universeId ? allLeagues.filter(l => l.universeId === universeId) : allLeagues;
  }

  joinLeague(leagueId: string, playerId: string): boolean {
    const league = this.leagues.get(leagueId);
    if (league && !league.participants.includes(playerId)) {
      league.participants.push(playerId);
      league.standings.push({
        playerId,
        points: 0,
        wins: 0,
        losses: 0,
        rank: league.standings.length + 1
      });
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Local Storage Management
  private saveToLocalStorage(): void {
    const data = {
      players: Array.from(this.players.entries()),
      playerStats: Array.from(this.playerStats.entries()),
      sessions: Array.from(this.sessions.entries()),
      leagues: Array.from(this.leagues.entries()),
      tournaments: Array.from(this.tournaments.entries())
    };
    localStorage.setItem('codequest_data', JSON.stringify(data));
  }

  private loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem('codequest_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.players = new Map(parsed.players || []);
        this.playerStats = new Map(parsed.playerStats || []);
        this.sessions = new Map(parsed.sessions || []);
        this.leagues = new Map(parsed.leagues || []);
        this.tournaments = new Map(parsed.tournaments || []);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private initializeDefaults(): void {
    // Create default player if none exists
    if (this.players.size === 0) {
      this.createPlayer('Joueur 1');
    }

    // Create default leagues
    if (this.leagues.size === 0) {
      universes.slice(0, 5).forEach(universe => {
        this.createLeague(universe.id, 1);
      });
    }
  }

  // Get current player (first player for now)
  getCurrentPlayer(): Player | undefined {
    return Array.from(this.players.values())[0];
  }

  resetGame(): void {
    localStorage.removeItem('codequest_data');
    this.players.clear();
    this.playerStats.clear();
    this.sessions.clear();
    this.leagues.clear();
    this.tournaments.clear();
    this.initializeDefaults();
  }
}

export const gameDB = new GameDatabase();