import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, Target, TrendingUp } from 'lucide-react';
import { GameSession, Badge as GameBadge } from '@/types/game';
import { gameDB } from '@/lib/gameDatabase';

interface ResultsScreenProps {
  session: GameSession;
  newBadges: GameBadge[];
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const ResultsScreen = ({ session, newBadges, onPlayAgain, onBackToMenu }: ResultsScreenProps) => {
  const universe = gameDB.getUniverses().find(u => u.id === session.universeId);
  const player = gameDB.getCurrentPlayer();
  const stats = gameDB.getPlayerStats(session.playerId, session.universeId)[0];

  const percentage = Math.round((session.score / session.questions.length) * 100);
  const timeTaken = session.endTime && session.startTime 
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
    : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Performance Exceptionnelle !", color: "text-yellow-500", icon: Trophy };
    if (percentage >= 80) return { message: "Très Bien Joué !", color: "text-green-500", icon: Star };
    if (percentage >= 70) return { message: "Bon Travail !", color: "text-blue-500", icon: Target };
    if (percentage >= 60) return { message: "Pas Mal !", color: "text-orange-500", icon: TrendingUp };
    return { message: "Il y a de la place pour s'améliorer", color: "text-gray-500", icon: Target };
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Résultats</h1>
          <p className="text-muted-foreground">
            {universe?.name} - Niveau {session.questions[0]?.level}
          </p>
        </div>

        {/* Score Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${performance.color}`}>
              <PerformanceIcon className="h-8 w-8" />
            </div>
            <CardTitle className={`text-2xl ${performance.color}`}>
              {performance.message}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-primary">
                {session.score}/{session.questions.length}
              </div>
              <div className="text-2xl font-semibold text-muted-foreground">
                {percentage}% de réussite
              </div>
              <Progress value={percentage} className="h-3 mx-auto max-w-md" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="font-semibold">Temps</div>
                <div className="text-lg text-muted-foreground">{formatTime(timeTaken)}</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="font-semibold">Précision</div>
                <div className="text-lg text-muted-foreground">{percentage}%</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="font-semibold">Points Gagnés</div>
                <div className="text-lg text-muted-foreground">+{session.score}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Badges */}
        {newBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Nouveaux Badges Débloqués !
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                      <Badge variant="outline" className="mt-1">
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Player Progress */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Progression dans {universe?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.level}</div>
                  <div className="text-sm text-muted-foreground">Niveau Actuel</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.score}</div>
                  <div className="text-sm text-muted-foreground">Score Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.questionsAnswered}</div>
                  <div className="text-sm text-muted-foreground">Questions Répondues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Taux de Réussite</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button size="lg" onClick={onPlayAgain} className="h-14">
            <Star className="h-5 w-5 mr-2" />
            Rejouer
          </Button>
          <Button size="lg" variant="outline" onClick={onBackToMenu} className="h-14">
            Retour au Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;