import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User, Trophy, Zap } from 'lucide-react';

interface GameMode {
  id: 'solo' | 'duel' | 'league' | 'tournament';
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: string;
  features: string[];
  available: boolean;
}

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode['id']) => void;
  universeId: string;
}

const GameModeSelector = ({ onModeSelect, universeId }: GameModeSelectorProps) => {
  const gameModes: GameMode[] = [
    {
      id: 'solo',
      name: 'Mode Solo',
      description: 'Entraînez-vous à votre rythme avec des questions adaptées à votre niveau',
      icon: <User className="h-8 w-8" />,
      difficulty: 'Adaptatif',
      features: ['20 questions', 'Progression sauvegardée', 'Badges débloquables', 'Statistiques détaillées'],
      available: true
    },
    {
      id: 'duel',
      name: 'Duel 1v1',
      description: 'Affrontez un autre joueur en temps réel dans un duel de connaissances',
      icon: <Zap className="h-8 w-8" />,
      difficulty: 'Compétitif',
      features: ['10 questions rapides', 'Temps limité', 'Classement ELO', 'Récompenses spéciales'],
      available: true
    },
    {
      id: 'league',
      name: 'Ligue',
      description: 'Participez à une ligue saisonnière et grimpez dans le classement',
      icon: <Trophy className="h-8 w-8" />,
      difficulty: 'Élite',
      features: ['Saisons mensuelles', 'Classement mondial', 'Récompenses exclusives', 'Tournois qualificatifs'],
      available: true
    },
    {
      id: 'tournament',
      name: 'Tournoi',
      description: 'Tournois à élimination directe avec de gros enjeux',
      icon: <Users className="h-8 w-8" />,
      difficulty: 'Légendaire',
      features: ['Format élimination', 'Grandes récompenses', 'Certificats officiels', 'Reconnaissance mondiale'],
      available: false // À implémenter plus tard
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Adaptatif': 'bg-green-500',
      'Compétitif': 'bg-yellow-500',
      'Élite': 'bg-orange-500',
      'Légendaire': 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Mode de Jeu</h2>
        <p className="text-muted-foreground">Choisissez comment vous voulez jouer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameModes.map(mode => (
          <Card 
            key={mode.id}
            className={`group transition-all duration-300 cursor-pointer border-2 hover:shadow-lg ${
              mode.available 
                ? 'hover:border-primary/50' 
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => mode.available && onModeSelect(mode.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${mode.available ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    {mode.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{mode.name}</CardTitle>
                    <Badge 
                      className={`${getDifficultyColor(mode.difficulty)} text-white text-xs mt-1`}
                    >
                      {mode.difficulty}
                    </Badge>
                  </div>
                </div>
                {!mode.available && (
                  <Badge variant="outline" className="text-xs">
                    Bientôt
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{mode.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Fonctionnalités :</h4>
                <ul className="space-y-1">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className={`w-full ${
                  mode.available 
                    ? 'group-hover:bg-primary group-hover:text-primary-foreground' 
                    : ''
                }`}
                variant="outline"
                disabled={!mode.available}
              >
                {mode.available ? 'Jouer' : 'Bientôt disponible'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameModeSelector;