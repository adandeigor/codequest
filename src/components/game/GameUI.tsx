import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerData, Achievement } from '@/lib/database';
import { Trophy, Star, Zap, Settings, RotateCcw } from 'lucide-react';

interface GameUIProps {
  playerData: PlayerData;
  achievements: Achievement[];
  onResetGame: () => void;
  isGameStarted: boolean;
  onStartGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  playerData,
  achievements,
  onResetGame,
  isGameStarted,
  onStartGame
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const experienceToNextLevel = (playerData.level * 100) - playerData.experience;

  if (isGameStarted) {
    return (
      <>
        {/* Quick Access Menu */}
        <div className="absolute top-4 right-4 z-20 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
              className="bg-card/80 backdrop-blur-sm border-primary/30 hover:bg-primary/20"
            >
              <Trophy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-card/80 backdrop-blur-sm border-primary/30 hover:bg-primary/20"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Achievements Panel */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-4 right-4 z-30 w-80"
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Succès</span>
                  </CardTitle>
                  <CardDescription>
                    {unlockedAchievements.length}/{achievements.length} débloqués
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-2 rounded-lg border ${
                        achievement.unlocked
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-muted/20 border-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${
                            achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <Star className="w-4 h-4 text-accent fill-current" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-4 right-4 z-30 w-80"
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <span>Paramètres</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Progression</div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-power h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(playerData.experience % 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {experienceToNextLevel} XP pour le niveau suivant
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onResetGame}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réinitialiser le jeu
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Welcome Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-crystal bg-clip-text text-transparent">
            Crystal Quest 3D
          </h1>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-crystal-blue rounded-full animate-glow" />
            <div className="w-3 h-3 bg-crystal-purple rounded-full animate-glow" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-3 bg-crystal-pink rounded-full animate-glow" style={{ animationDelay: '1s' }} />
            <div className="w-3 h-3 bg-crystal-gold rounded-full animate-glow" style={{ animationDelay: '1.5s' }} />
            <div className="w-3 h-3 bg-crystal-green rounded-full animate-glow" style={{ animationDelay: '2s' }} />
          </div>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{playerData.level}</div>
              <div className="text-sm text-muted-foreground">Niveau</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{playerData.totalScore}</div>
              <div className="text-sm text-muted-foreground">Score Total</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{playerData.crystalsCollected}</div>
              <div className="text-sm text-muted-foreground">Cristaux</div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-crystal-gold/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-crystal-gold">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Succès</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          <p className="text-lg text-foreground/80">
            Explorez un univers 3D magique et collectez des cristaux précieux !
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-crystal-blue text-crystal-blue">
              🔵 Cristal Bleu - 10 pts
            </Badge>
            <Badge variant="outline" className="border-crystal-purple text-crystal-purple">
              🟣 Cristal Violet - 25 pts
            </Badge>
            <Badge variant="outline" className="border-crystal-pink text-crystal-pink">
              🩷 Cristal Rose - 50 pts
            </Badge>
            <Badge variant="outline" className="border-crystal-gold text-crystal-gold">
              🟡 Cristal Or - 100 pts
            </Badge>
            <Badge variant="outline" className="border-crystal-green text-crystal-green">
              🟢 Cristal Vert - 15 pts
            </Badge>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={onStartGame}
            className="bg-gradient-cosmic text-primary-foreground hover:shadow-glow-primary transition-all duration-300 text-xl px-12 py-6"
          >
            <Zap className="w-6 h-6 mr-2" />
            Commencer l'Aventure
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameUI;