import { useState, useEffect } from 'react';
import { CodeQuestGame } from "@/components/game/CodeQuestGame";
import { LandingPage } from "@/components/landing/LandingPage";
import { gameDB } from "@/lib/gameDatabase";
import { Player } from "@/types/game";

const Index = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const player = gameDB.getCurrentPlayer();
    setCurrentPlayer(player || null);
    setLoading(false);
  }, []);

  const handleAuth = (player: Player) => {
    gameDB.setCurrentPlayer(player.id);
    setCurrentPlayer(player);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentPlayer) {
    return <LandingPage onAuth={handleAuth} />;
  }

  return <CodeQuestGame player={currentPlayer} />;
};

export default Index;
