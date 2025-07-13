import { useState, useEffect } from 'react';
import { Universe, GameSession, Badge as GameBadge } from '@/types/game';
import { gameDB } from '@/lib/gameDatabase';
import UniverseSelector from './UniverseSelector';
import GameModeSelector from './GameModeSelector';
import QuizGame from './QuizGame';
import DuelGame from './DuelGame';
import ResultsScreen from './ResultsScreen';
import PlayerDashboard from './PlayerDashboard';
import SettingsDialog from './SettingsDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Trophy } from 'lucide-react';
import { multiplayerManager } from '@/lib/redisClient';

type GameState = 'dashboard' | 'universe-select' | 'mode-select' | 'playing' | 'duel' | 'results';

const CodeQuestGame = () => {
  const [gameState, setGameState] = useState<GameState>('dashboard');
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [newBadges, setNewBadges] = useState<GameBadge[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [duelRoomId, setDuelRoomId] = useState<string | null>(null);

  const universes = gameDB.getUniverses();
  const player = gameDB.getCurrentPlayer();

  // Initialize player stats for all universes
  useEffect(() => {
    if (player) {
      universes.forEach(universe => {
        const stats = gameDB.getPlayerStats(player.id, universe.id);
        if (stats.length === 0) {
          // Initialize stats for this universe if they don't exist
          gameDB.updatePlayerStats(player.id, universe.id, {
            playerId: player.id,
            universeId: universe.id,
            level: 1,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            completedLevels: [],
            badges: [],
            certificates: []
          });
        }
      });
    }
  }, [player, universes]);

  const handleUniverseSelect = (universe: Universe) => {
    setSelectedUniverse(universe);
    setGameState('mode-select');
  };

  const handleModeSelect = async (mode: 'solo' | 'duel' | 'league' | 'tournament') => {
    if (!selectedUniverse || !player) return;

    if (mode === 'duel') {
      // Create or join a duel room
      const roomId = await multiplayerManager.createDuelRoom(player.id, selectedUniverse.id);
      setDuelRoomId(roomId);
      const session = gameDB.createGameSession(player.id, selectedUniverse.id, mode, 'normal');
      setCurrentSession(session);
      setGameState('duel');
    } else {
      const session = gameDB.createGameSession(player.id, selectedUniverse.id, mode, 'normal');
      setCurrentSession(session);
      setGameState('playing');
    }
  };

  const handleGameComplete = (session: GameSession) => {
    // Get any new badges that might have been unlocked
    const stats = gameDB.getPlayerStats(session.playerId, session.universeId)[0];
    const recentBadges = stats?.badges?.slice(-2) || []; // Get last 2 badges as "new"
    setNewBadges(recentBadges);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameState('mode-select');
    setNewBadges([]);
  };

  const handleBackToMenu = () => {
    setGameState('dashboard');
    setSelectedUniverse(null);
    setCurrentSession(null);
    setNewBadges([]);
  };

  const getPlayerStats = () => {
    if (!player) return {};
    
    const stats: { [universeId: string]: { level: number; progress: number; completed: boolean } } = {};
    
    universes.forEach(universe => {
      const universeStats = gameDB.getPlayerStats(player.id, universe.id)[0];
      if (universeStats) {
        stats[universe.id] = {
          level: universeStats.level,
          progress: (universeStats.level / universe.totalLevels) * 100,
          completed: universeStats.level >= universe.totalLevels
        };
      }
    });
    
    return stats;
  };

  if (showDashboard) {
    return (
      <PlayerDashboard 
        player={player}
        onClose={() => setShowDashboard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-primary">
                🧠 CodeQuest
              </div>
              {selectedUniverse && (
                <Badge variant="outline" className="ml-2">
                  {selectedUniverse.icon} {selectedUniverse.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {player && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDashboard(true)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {player.name}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trophy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {gameState === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-5xl font-bold text-primary">
                Bienvenue sur CodeQuest
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Testez vos connaissances en programmation, affrontez d'autres développeurs et 
                progressez dans votre domaine d'expertise !
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setGameState('universe-select')}
                  className="h-14 px-8"
                >
                  Commencer à Jouer
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowDashboard(true)}
                  className="h-14 px-8"
                >
                  Voir mes Statistiques
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            {player && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-card border rounded-lg">
                  <div className="text-3xl font-bold text-primary">{player.totalScore}</div>
                  <div className="text-muted-foreground">Score Total</div>
                </div>
                <div className="text-center p-6 bg-card border rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {Object.values(getPlayerStats()).filter(s => s.completed).length}
                  </div>
                  <div className="text-muted-foreground">Univers Maîtrisés</div>
                </div>
                <div className="text-center p-6 bg-card border rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {universes.reduce((total, universe) => {
                      const stats = gameDB.getPlayerStats(player.id, universe.id)[0];
                      return total + (stats?.badges?.length || 0);
                    }, 0)}
                  </div>
                  <div className="text-muted-foreground">Badges Gagnés</div>
                </div>
                <div className="text-center p-6 bg-card border rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(Object.values(getPlayerStats()).reduce((sum, s) => sum + s.progress, 0) / universes.length)}%
                  </div>
                  <div className="text-muted-foreground">Progression Moyenne</div>
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === 'universe-select' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <UniverseSelector 
              universes={universes}
              onUniverseSelect={handleUniverseSelect}
              playerStats={getPlayerStats()}
            />
          </div>
        )}

        {gameState === 'mode-select' && selectedUniverse && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <GameModeSelector 
              universeId={selectedUniverse.id}
              onModeSelect={handleModeSelect}
            />
          </div>
        )}

        {gameState === 'playing' && currentSession && (
          <QuizGame 
            session={currentSession}
            onComplete={handleGameComplete}
            onExit={handleBackToMenu}
          />
        )}

        {gameState === 'duel' && currentSession && duelRoomId && (
          <DuelGame 
            session={currentSession}
            roomId={duelRoomId}
            onComplete={handleGameComplete}
            onExit={handleBackToMenu}
          />
        )}

        {gameState === 'results' && currentSession && (
          <ResultsScreen 
            session={currentSession}
            newBadges={newBadges}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </main>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={showSettings}
        onOpenChange={setShowSettings}
        player={player}
      />
    </div>
  );
};

export default CodeQuestGame;