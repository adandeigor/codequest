import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types/game';
import { gameDB } from '@/lib/gameDatabase';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
}

const SettingsDialog = ({ open, onOpenChange, player }: SettingsDialogProps) => {
  const [playerName, setPlayerName] = useState(player?.name || '');
  const { theme, setTheme } = useTheme();

  const handleSavePlayerName = () => {
    if (!player || !playerName.trim()) return;
    
    gameDB.updatePlayer(player.id, { name: playerName.trim() });
    onOpenChange(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Player Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil Joueur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playerName">Nom du joueur</Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Entrez votre nom"
                />
              </div>
              <Button onClick={handleSavePlayerName} disabled={!playerName.trim()}>
                Sauvegarder le nom
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apparence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Player Stats Summary */}
          {player && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Score Total</div>
                    <div className="text-muted-foreground">{player.totalScore}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Parties Jouées</div>
                    <div className="text-muted-foreground">{player.gamesPlayed}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Victoires</div>
                    <div className="text-muted-foreground">{player.wins}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Défaites</div>
                    <div className="text-muted-foreground">{player.losses}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;