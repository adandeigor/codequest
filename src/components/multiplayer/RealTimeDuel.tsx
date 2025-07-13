import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Star, Users, Zap } from 'lucide-react';
import { GameSession, Question, Player } from '@/types/game';
import { multiplayerManager } from '@/lib/redisClient';

interface RealTimeDuelProps {
  roomId: string;
  player: Player;
  opponent: Player;
  questions: Question[];
  onComplete: (results: any) => void;
  onExit: () => void;
}

export const RealTimeDuel = ({ roomId, player, opponent, questions, onComplete, onExit }: RealTimeDuelProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [opponentAnswer, setOpponentAnswer] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (showResult || !isPlayerTurn) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResult, isPlayerTurn]);

  // Check opponent answers
  useEffect(() => {
    if (waitingForOpponent) {
      const checkOpponentAnswer = async () => {
        const results = await multiplayerManager.getDuelQuestionResults(roomId, currentQuestionIndex);
        const opponentData = player.id === results.player1?.playerId ? results.player2 : results.player1;
        
        if (opponentData) {
          setOpponentAnswer(opponentData.answer);
          setWaitingForOpponent(false);
          handleQuestionComplete(selectedAnswer, opponentData.answer, timeLeft, opponentData.timeLeft);
        }
      };

      const interval = setInterval(checkOpponentAnswer, 1000);
      return () => clearInterval(interval);
    }
  }, [waitingForOpponent, currentQuestionIndex]);

  const handleTimeUp = () => {
    if (isPlayerTurn) {
      // Player's time is up, pass to opponent
      setIsPlayerTurn(false);
      setSelectedAnswer(null);
      // Notify opponent it's their turn
    } else {
      // Both players failed to answer, move to next question
      handleQuestionComplete(null, null, 0, 0);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    if (showResult || !isPlayerTurn) return;

    setSelectedAnswer(answerIndex);
    setWaitingForOpponent(true);

    // Submit answer to Redis
    await multiplayerManager.submitDuelAnswer(roomId, player.id, currentQuestionIndex, answerIndex, timeLeft);

    // Check if opponent has already answered
    const results = await multiplayerManager.getDuelQuestionResults(roomId, currentQuestionIndex);
    const opponentData = player.id === results.player1?.playerId ? results.player2 : results.player1;
    
    if (opponentData) {
      setOpponentAnswer(opponentData.answer);
      setWaitingForOpponent(false);
      handleQuestionComplete(answerIndex, opponentData.answer, timeLeft, opponentData.timeLeft);
    }
  };

  const handleQuestionComplete = (playerAns: number | null, oppAns: number | null, playerTime: number, oppTime: number) => {
    const correctAnswer = currentQuestion.correctAnswer;
    
    let playerPoints = 0;
    let opponentPoints = 0;

    // Calculate points based on correctness and speed
    if (playerAns === correctAnswer) {
      playerPoints = Math.max(1, Math.floor(playerTime / 3)); // More points for faster answers
    }
    
    if (oppAns === correctAnswer) {
      opponentPoints = Math.max(1, Math.floor(oppTime / 3));
    }

    setPlayerScore(prev => prev + playerPoints);
    setOpponentScore(prev => prev + opponentPoints);
    setShowResult(true);

    // Auto advance after 4 seconds
    setTimeout(() => {
      if (isLastQuestion) {
        onComplete({
          playerScore: playerScore + playerPoints,
          opponentScore: opponentScore + opponentPoints,
          winner: (playerScore + playerPoints) > (opponentScore + opponentPoints) ? player : opponent
        });
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setOpponentAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
        setIsPlayerTurn(true);
        setWaitingForOpponent(false);
      }
    }, 4000);
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

    if ((selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer) ||
        (opponentAnswer === index && opponentAnswer !== currentQuestion.correctAnswer)) {
      return 'border-red-500 bg-red-50 text-red-700';
    }

    return 'border-border bg-muted/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onExit}>
            ← Quitter le duel
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Users className="h-4 w-4 mr-1" />
              Duel 1v1
            </Badge>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <Card className={`border-2 ${isPlayerTurn ? 'border-primary' : 'border-border'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {isPlayerTurn && <Zap className="h-5 w-5 text-primary animate-pulse" />}
                {player.name} (Vous)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{playerScore}</div>
            </CardContent>
          </Card>
          
          <Card className={`border-2 ${!isPlayerTurn ? 'border-primary' : 'border-border'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {!isPlayerTurn && <Zap className="h-5 w-5 text-primary animate-pulse" />}
                {opponent.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{opponentScore}</div>
            </CardContent>
          </Card>
        </div>

        {/* Timer and Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
            <div className={`flex items-center gap-2 ${timeLeft > 20 ? 'text-green-500' : timeLeft > 10 ? 'text-yellow-500' : 'text-red-500'}`}>
              <Clock className="h-5 w-5" />
              <span className="text-lg font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Turn Indicator */}
        {!showResult && (
          <div className={`text-center p-3 rounded-lg ${isPlayerTurn ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {isPlayerTurn ? '🎯 À votre tour !' : '⏳ Au tour de votre adversaire...'}
            {waitingForOpponent && '⏳ En attente de la réponse adverse...'}
          </div>
        )}

        {/* Question Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
              <Badge variant="outline">Niveau {currentQuestion.level}</Badge>
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
                  disabled={showResult || !isPlayerTurn || waitingForOpponent}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${getOptionStyle(index)} ${
                    (!isPlayerTurn || waitingForOpponent) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                    {showResult && ((selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer) ||
                                  (opponentAnswer === index && opponentAnswer !== currentQuestion.correctAnswer)) && (
                      <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Result */}
            {showResult && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className={`p-3 rounded-lg ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="font-semibold">Votre réponse</div>
                    <div>{selectedAnswer !== null ? String.fromCharCode(65 + selectedAnswer) : 'Pas de réponse'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${opponentAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="font-semibold">Réponse adverse</div>
                    <div>{opponentAnswer !== null ? String.fromCharCode(65 + opponentAnswer) : 'Pas de réponse'}</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Explication :</h4>
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};