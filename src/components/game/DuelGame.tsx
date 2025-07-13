import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Star, Users, Trophy } from 'lucide-react';
import { GameSession, Question } from '@/types/game';
import { multiplayerManager } from '@/lib/redisClient';
import { gameDB } from '@/lib/gameDatabase';

interface DuelGameProps {
  session: GameSession;
  roomId: string;
  onComplete: (session: GameSession) => void;
  onExit: () => void;
}

const DuelGame = ({ session, roomId, onComplete, onExit }: DuelGameProps) => {
  const [currentSession, setCurrentSession] = useState<GameSession>(session);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCorrect, setIsCorrect] = useState(false);
  const [opponentAnswer, setOpponentAnswer] = useState<any>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (showResult || waitingForOpponent) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession.currentQuestionIndex, showResult, waitingForOpponent]);

  // Reset for new question
  useEffect(() => {
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
    setWaitingForOpponent(false);
    setOpponentAnswer(null);
  }, [currentSession.currentQuestionIndex]);

  const handleAnswer = async (answerIndex: number | null) => {
    if (showResult || waitingForOpponent) return;

    const correct = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setWaitingForOpponent(true);

    // Submit answer to Redis
    await multiplayerManager.submitDuelAnswer(
      roomId, 
      session.playerId, 
      currentSession.currentQuestionIndex, 
      answerIndex, 
      timeLeft
    );

    // Wait for opponent answer and show results
    setTimeout(async () => {
      const results = await multiplayerManager.getDuelQuestionResults(roomId, currentSession.currentQuestionIndex);
      const opponentResult = results.player1?.playerId === session.playerId ? results.player2 : results.player1;
      
      setOpponentAnswer(opponentResult);
      setWaitingForOpponent(false);
      setShowResult(true);

      // Update scores
      if (correct) {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      }
      if (opponentResult && opponentResult.answer === currentQuestion.correctAnswer) {
        setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      }
    }, 2000); // Simulate network delay
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalSession = {
        ...currentSession,
        endTime: new Date(),
        score: scores.player
      };
      setCurrentSession(finalSession);
      onComplete(finalSession);
    } else {
      const nextIndex = currentSession.currentQuestionIndex + 1;
      const updatedSession = {
        ...currentSession,
        currentQuestionIndex: nextIndex
      };
      setCurrentSession(updatedSession);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-500';
    if (timeLeft > 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50 hover:bg-muted/50';
    }

    if (index === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-700';
    }

    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-700';
    }

    return 'border-border bg-muted/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec scores */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onExit}>
            ← Quitter le Duel
          </Button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Badge variant="default" className="text-lg px-3 py-1">
                <Trophy className="h-4 w-4 mr-1" />
                Vous: {scores.player}
              </Badge>
              <Badge variant="outline" className="text-lg px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                Adversaire: {scores.opponent}
              </Badge>
            </div>
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="h-5 w-5" />
              <span className="text-lg font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentSession.currentQuestionIndex + 1} sur {currentSession.questions.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status */}
        {waitingForOpponent && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-yellow-700">
                <Clock className="h-5 w-5 animate-spin" />
                <span>En attente de la réponse de votre adversaire...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">
                Niveau {currentQuestion.level}
              </Badge>
              <Badge variant="destructive">
                DUEL
              </Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult || waitingForOpponent}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${getOptionStyle(index)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Results */}
            {showResult && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  {/* Your result */}
                  <div className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className={`flex items-center gap-2 font-semibold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? <Star className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      Votre réponse: {isCorrect ? 'Correcte!' : 'Incorrecte'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Temps restant: {timeLeft}s
                    </div>
                  </div>

                  {/* Opponent result */}
                  <div className={`p-4 rounded-lg border ${
                    opponentAnswer?.answer === currentQuestion.correctAnswer 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className={`flex items-center gap-2 font-semibold ${
                      opponentAnswer?.answer === currentQuestion.correctAnswer 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {opponentAnswer?.answer === currentQuestion.correctAnswer 
                        ? <Star className="h-5 w-5" /> 
                        : <XCircle className="h-5 w-5" />
                      }
                      Adversaire: {opponentAnswer?.answer === currentQuestion.correctAnswer ? 'Correcte!' : 'Incorrecte'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Temps restant: {opponentAnswer?.timeLeft || 0}s
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Explication :</h4>
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full"
                  size="lg"
                >
                  {isLastQuestion ? 'Voir les résultats du duel' : 'Question suivante'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DuelGame;