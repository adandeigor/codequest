import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock } from 'lucide-react';
import { gameDB } from '@/lib/gameDatabase';
import { Player } from '@/types/game';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuth: (player: Player) => void;
}

export const AuthDialog = ({ open, onOpenChange, onAuth }: AuthDialogProps) => {
  const [loginData, setLoginData] = useState({ name: '', email: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.name.trim()) return;
    
    setLoading(true);
    
    // Check if player exists
    const existingPlayer = gameDB.getAllPlayers().find(p => 
      p.name.toLowerCase() === loginData.name.toLowerCase() ||
      (p.email && loginData.email && p.email.toLowerCase() === loginData.email.toLowerCase())
    );

    if (existingPlayer) {
      onAuth(existingPlayer);
      onOpenChange(false);
    } else {
      // Create new player
      const newPlayer = gameDB.createPlayer(loginData.name, loginData.email);
      onAuth(newPlayer);
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!registerData.name.trim()) return;
    
    setLoading(true);
    
    // Check if player already exists
    const existingPlayer = gameDB.getAllPlayers().find(p => 
      p.name.toLowerCase() === registerData.name.toLowerCase() ||
      (p.email && registerData.email && p.email.toLowerCase() === registerData.email.toLowerCase())
    );

    if (existingPlayer) {
      alert('Un joueur avec ce nom ou email existe déjà');
      setLoading(false);
      return;
    }

    const newPlayer = gameDB.createPlayer(registerData.name, registerData.email);
    onAuth(newPlayer);
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Bienvenue sur CodeQuest</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Se connecter</CardTitle>
                <CardDescription>
                  Entrez vos informations pour accéder à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-name">Nom du joueur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-name"
                      type="text"
                      placeholder="Votre nom"
                      className="pl-10"
                      value={loginData.name}
                      onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email (optionnel)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogin} 
                  className="w-full" 
                  disabled={loading || !loginData.name.trim()}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Créer un compte</CardTitle>
                <CardDescription>
                  Créez votre compte pour commencer à jouer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nom du joueur *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Choisissez un nom"
                      className="pl-10"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email (optionnel)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleRegister} 
                  className="w-full" 
                  disabled={loading || !registerData.name.trim()}
                >
                  {loading ? 'Création...' : 'Créer le compte'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};