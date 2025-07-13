import { useState } from 'react';
import { Universe } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface UniverseSelectorProps {
  universes: Universe[];
  onUniverseSelect: (universe: Universe) => void;
  playerStats?: { [universeId: string]: { level: number; progress: number; completed: boolean } };
}

const UniverseSelector = ({ universes, onUniverseSelect, playerStats = {} }: UniverseSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous', icon: '🌐' },
    { id: 'web', name: 'Web Dev', icon: '🌍' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
    { id: 'data', name: 'Data Science', icon: '📊' },
    { id: 'ai', name: 'IA & ML', icon: '🤖' },
    { id: 'systems', name: 'Systèmes', icon: '⚙️' },
    { id: 'game', name: 'Game Dev', icon: '🎮' }
  ];

  const filteredUniverses = selectedCategory === 'all' 
    ? universes 
    : universes.filter(u => u.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      web: 'bg-blue-500',
      mobile: 'bg-green-500',
      data: 'bg-purple-500',
      ai: 'bg-red-500',
      systems: 'bg-yellow-500',
      game: 'bg-pink-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Choisissez votre Univers</h2>
        <p className="text-muted-foreground">Sélectionnez le domaine dans lequel vous voulez tester vos connaissances</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUniverses.map(universe => {
              const stats = playerStats[universe.id];
              const completionPercentage = stats ? (stats.level / universe.totalLevels) * 100 : 0;

              return (
                <Card 
                  key={universe.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => onUniverseSelect(universe)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{universe.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{universe.name}</CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`${getCategoryColor(universe.category)} text-white text-xs`}
                          >
                            {categories.find(c => c.id === universe.category)?.name}
                          </Badge>
                        </div>
                      </div>
                      {stats?.completed && <span className="text-green-500">✅</span>}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{universe.description}</p>
                    
                    {stats && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Niveau {stats.level}/{universe.totalLevels}</span>
                          <span>{Math.round(completionPercentage)}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                      </div>
                    )}

                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      variant="outline"
                    >
                      {stats ? 'Continuer' : 'Commencer'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniverseSelector;