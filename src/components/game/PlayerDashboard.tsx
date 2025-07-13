import { useState } from 'react';
import { Player } from '@/types/game';
import { gameDB } from '@/lib/gameDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Star, Target, TrendingUp, Award, X } from 'lucide-react';

interface PlayerDashboardProps {
  player: Player | undefined;
  onClose: () => void;
}

const PlayerDashboard = ({ player, onClose }: PlayerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!player) return null;

  const universes = gameDB.getUniverses();
  const allPlayerStats = gameDB.getPlayerStats(player.id);
  
  const totalBadges = allPlayerStats.reduce((total, stats) => total + stats.badges.length, 0);
  const totalQuestions = allPlayerStats.reduce((total, stats) => total + stats.questionsAnswered, 0);
  const totalCorrect = allPlayerStats.reduce((total, stats) => total + stats.correctAnswers, 0);
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const topUniverses = allPlayerStats
    .map(stats => ({
      ...stats,
      universe: universes.find(u => u.id === stats.universeId),
      accuracy: stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const recentBadges = allPlayerStats
    .flatMap(stats => stats.badges.map(badge => ({ ...badge, universe: universes.find(u => u.id === stats.universeId) })))
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 6);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">
                {player.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">{player.name}</h1>
              <p className="text-muted-foreground">
                Membre depuis {new Date(player.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{player.totalScore}</div>
                <div className="text-sm text-muted-foreground">Score Total</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalBadges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{averageAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Précision</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="universes">Univers</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="certificates">Certificats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Universes */}
            <Card>
              <CardHeader>
                <CardTitle>Meilleurs Univers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUniverses.map((stats, index) => (
                    <div key={stats.universeId} className="flex items-center gap-4">
                      <div className="text-lg font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </div>
                      <span className="text-2xl">{stats.universe?.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{stats.universe?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Niveau {stats.level} • {stats.score} points • {stats.accuracy}% précision
                        </div>
                      </div>
                      <Badge variant="outline">{stats.badges.length} badges</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentBadges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.universe?.name}</div>
                        <Badge 
                          className={`${getRarityColor(badge.rarity)} text-white text-xs mt-1`}
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="universes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPlayerStats.map(stats => {
                const universe = universes.find(u => u.id === stats.universeId);
                const progress = universe ? (stats.level / universe.totalLevels) * 100 : 0;
                const accuracy = stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0;

                return (
                  <Card key={stats.universeId}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{universe?.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{universe?.name}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            Niveau {stats.level}/{universe?.totalLevels}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-primary">{stats.score}</div>
                          <div className="text-muted-foreground">Score</div>
                        </div>
                        <div>
                          <div className="font-bold text-primary">{accuracy}%</div>
                          <div className="text-muted-foreground">Précision</div>
                        </div>
                        <div>
                          <div className="font-bold text-primary">{stats.badges.length}</div>
                          <div className="text-muted-foreground">Badges</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlayerStats.flatMap(stats => 
                stats.badges.map(badge => ({
                  ...badge,
                  universe: universes.find(u => u.id === stats.universeId)
                }))
              ).map((badge, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{badge.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            className={`${getRarityColor(badge.rarity)} text-white text-xs`}
                          >
                            {badge.rarity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {badge.universe?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun Certificat pour le moment</h3>
                <p className="text-muted-foreground">
                  Complétez des univers entiers et gagnez des compétitions pour débloquer des certificats officiels !
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerDashboard;