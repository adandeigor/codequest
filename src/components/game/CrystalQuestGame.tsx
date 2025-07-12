import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameDatabase, PlayerData, Crystal, Achievement } from '@/lib/database';
import GameWorld from './GameWorld';
import GameUI from './GameUI';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Star, Zap } from 'lucide-react';

const CrystalQuestGame: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const { toast } = useToast();

  // Initialize game data
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const player = await gameDatabase.getPlayerData();
        const crystalData = await gameDatabase.getCrystals();
        const achievementData = await gameDatabase.getAchievements();

        setPlayerData(player);
        setCrystals(crystalData);
        setAchievements(achievementData);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du jeu",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [toast]);

  // Check for achievements
  const checkAchievements = useCallback(async (updatedPlayerData: PlayerData) => {
    const currentAchievements = await gameDatabase.getAchievements();
    
    for (const achievement of currentAchievements) {
      if (!achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_crystal':
            shouldUnlock = updatedPlayerData.crystalsCollected >= 1;
            break;
          case 'crystal_hunter':
            shouldUnlock = updatedPlayerData.crystalsCollected >= 10;
            break;
          case 'crystal_master':
            shouldUnlock = updatedPlayerData.crystalsCollected >= 50;
            break;
          case 'level_up':
            shouldUnlock = updatedPlayerData.level >= 2;
            break;
          case 'experienced':
            shouldUnlock = updatedPlayerData.level >= 5;
            break;
          case 'score_milestone':
            shouldUnlock = updatedPlayerData.totalScore >= 1000;
            break;
        }
        
        if (shouldUnlock) {
          await gameDatabase.unlockAchievement(achievement.id);
          
          // Show achievement notification
          setCelebrationMessage(`🏆 Succès débloqué: ${achievement.name}!`);
          setShowCelebration(true);
          
          toast({
            title: "🏆 Succès débloqué!",
            description: achievement.name,
            duration: 3000,
          });
          
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
    }
    
    // Update achievements state
    const updatedAchievements = await gameDatabase.getAchievements();
    setAchievements(updatedAchievements);
  }, [toast]);

  // Handle crystal collection
  const handleCrystalCollect = useCallback(async (crystalId: string) => {
    if (!playerData) return;

    const crystal = crystals.find(c => c.id === crystalId);
    if (!crystal) return;

    try {
      // Update database
      await gameDatabase.collectCrystal(crystalId);

      // Calculate new stats
      const newExperience = playerData.experience + crystal.value;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const newScore = playerData.totalScore + crystal.value;
      const newCrystalsCollected = playerData.crystalsCollected + 1;

      const updatedPlayerData: PlayerData = {
        ...playerData,
        experience: newExperience,
        level: newLevel,
        totalScore: newScore,
        crystalsCollected: newCrystalsCollected
      };

      // Update player data in database
      await gameDatabase.updatePlayerData({
        experience: newExperience,
        level: newLevel,
        totalScore: newScore,
        crystalsCollected: newCrystalsCollected
      });

      // Update local state
      setPlayerData(updatedPlayerData);
      setCrystals(crystals.filter(c => c.id !== crystalId));

      // Show collection effect
      toast({
        title: "Cristal collecté! ✨",
        description: `+${crystal.value} points`,
        duration: 2000,
      });

      // Check for level up
      if (newLevel > playerData.level) {
        setCelebrationMessage(`🎉 Niveau ${newLevel} atteint!`);
        setShowCelebration(true);
        
        toast({
          title: "🎉 Niveau supérieur!",
          description: `Niveau ${newLevel} atteint!`,
          duration: 3000,
        });
        
        setTimeout(() => setShowCelebration(false), 3000);
      }

      // Check achievements
      await checkAchievements(updatedPlayerData);

    } catch (error) {
      console.error('Failed to collect crystal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de collecter le cristal",
        variant: "destructive"
      });
    }
  }, [playerData, crystals, toast, checkAchievements]);

  // Start game
  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  // Reset game
  const handleResetGame = async () => {
    try {
      await gameDatabase.resetGame();
      
      // Reload game data
      const player = await gameDatabase.getPlayerData();
      const crystalData = await gameDatabase.getCrystals();
      const achievementData = await gameDatabase.getAchievements();

      setPlayerData(player);
      setCrystals(crystalData);
      setAchievements(achievementData);
      setIsGameStarted(false);

      toast({
        title: "Jeu réinitialisé",
        description: "Nouvelle partie commencée!",
      });
    } catch (error) {
      console.error('Failed to reset game:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser le jeu",
        variant: "destructive"
      });
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl font-bold bg-gradient-crystal bg-clip-text text-transparent">
            Crystal Quest 3D
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="text-muted-foreground">Chargement...</div>
        </motion.div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-foreground">
          <div className="text-2xl font-bold mb-4">Erreur de chargement</div>
          <div className="text-muted-foreground">Impossible de charger les données du jeu</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="bg-gradient-cosmic p-8 rounded-2xl text-center shadow-glow-crystal"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: 2
              }}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {celebrationMessage}
              </div>
              <Sparkles className="w-12 h-12 mx-auto text-accent animate-glow" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      {isGameStarted ? (
        <>
          <GameWorld
            crystals={crystals}
            onCrystalCollect={handleCrystalCollect}
            score={playerData.totalScore}
            level={playerData.level}
          />
          <GameUI
            playerData={playerData}
            achievements={achievements}
            onResetGame={handleResetGame}
            isGameStarted={isGameStarted}
            onStartGame={handleStartGame}
          />
        </>
      ) : (
        <GameUI
          playerData={playerData}
          achievements={achievements}
          onResetGame={handleResetGame}
          isGameStarted={isGameStarted}
          onStartGame={handleStartGame}
        />
      )}
    </div>
  );
};

export default CrystalQuestGame;