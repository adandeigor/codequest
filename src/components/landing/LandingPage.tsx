import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Users, Trophy, Zap, Star, Target, Globe, Gamepad2 } from 'lucide-react';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Player } from '@/types/game';

interface LandingPageProps {
  onAuth: (player: Player) => void;
}

export const LandingPage = ({ onAuth }: LandingPageProps) => {
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      icon: Code,
      title: 'Multiple Univers',
      description: '27+ univers de programmation : Web, Mobile, IA, Data Science...',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Modes Multijoueurs',
      description: 'Défis 1v1, ligues par univers, tournois épiques',
      color: 'text-green-500'
    },
    {
      icon: Trophy,
      title: 'Système de Badges',
      description: 'Gagnez badges et certifications selon vos performances',
      color: 'text-yellow-500'
    },
    {
      icon: Zap,
      title: 'Temps Réel',
      description: 'Compétitions en direct avec classements instantanés',
      color: 'text-purple-500'
    }
  ];

  const gameModes = [
    {
      title: 'Solo',
      description: 'Perfectionnez vos compétences à votre rythme',
      icon: Target
    },
    {
      title: 'Duel 1v1',
      description: 'Défiez vos amis en temps réel',
      icon: Gamepad2
    },
    {
      title: 'Ligues',
      description: 'Compétitions par univers avec classements',
      icon: Star
    },
    {
      title: 'Tournois',
      description: 'Grands événements avec récompenses spéciales',
      icon: Trophy
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                🚀 Nouvelle génération de quiz coding
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                CodeQuest
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Testez vos compétences en programmation à travers 27+ univers technologiques
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowAuth(true)} className="text-lg px-8 py-6">
                Commencer à jouer
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Voir les univers
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Code className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <Globe className="h-16 w-16 text-primary animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi CodeQuest ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une plateforme complète pour tester et améliorer vos compétences techniques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mx-auto ${feature.color}`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Modes de Jeu</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choisissez votre style de jeu et progressez à votre façon
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameModes.map((mode, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <mode.icon className="h-10 w-10 mx-auto text-primary" />
                  <CardTitle className="text-lg">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{mode.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Prêt à relever le défi ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Rejoignez des milliers de développeurs qui testent leurs compétences sur CodeQuest
            </p>
            <Button size="lg" onClick={() => setShowAuth(true)} className="text-lg px-12 py-6">
              Commencer maintenant
            </Button>
          </div>
        </div>
      </section>

      <AuthDialog 
        open={showAuth} 
        onOpenChange={setShowAuth} 
        onAuth={onAuth}
      />
    </div>
  );
};