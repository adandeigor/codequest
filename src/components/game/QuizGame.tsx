import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { GameSession, Question } from '@/types/game';
import { gameDB } from '@/lib/gameDatabase';

interface QuizGameProps {
  session: GameSession;
  onComplete: (session: GameSession) => void;
  onExit: () => void;
}

const QuizGame = ({ session, onComplete, onExit }: QuizGameProps) => {
  const [currentSession, setCurrentSession] = useState<GameSession>(session);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - just show result without selecting answer
          setSelectedAnswer(null);
          setIsCorrect(false);
          setShowResult(true);
          
          // Auto advance after 3 seconds
          setTimeout(() => {
            handleNext();
          }, 3000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession.currentQuestionIndex, showResult]);

  // Reset timer and selection for new question
  useEffect(() => {
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentSession.currentQuestionIndex]);

  const handleAnswer = (answerIndex: number | null) => {
    if (showResult) return;

    const correct = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setShowResult(true);

    // Update score
    if (correct) {
      const updatedSession = {
        ...currentSession,
        score: currentSession.score + 1
      };
      setCurrentSession(updatedSession);
      gameDB.updateGameSession(session.id, { score: updatedSession.score });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalSession = {
        ...currentSession,
        endTime: new Date()
      };
      setCurrentSession(finalSession);
      gameDB.completeGameSession(session.id);
      onComplete(finalSession);
    } else {
      const nextIndex = currentSession.currentQuestionIndex + 1;
      const updatedSession = {
        ...currentSession,
        currentQuestionIndex: nextIndex
      };
      setCurrentSession(updatedSession);
      gameDB.updateGameSession(session.id, { currentQuestionIndex: nextIndex });
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onExit}>
            ← Quitter
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Score: {currentSession.score}/{currentSession.questions.length}
            </Badge>
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
                  disabled={showResult}
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

            {/* Result and Explanation */}
            {showResult && (
              <div className="space-y-4 pt-4 border-t">
                <div className={`flex items-center gap-2 text-lg font-semibold ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrect ? (
                    <>
                      <Star className="h-6 w-6" />
                      Excellente réponse !
                    </>
                  ) : selectedAnswer === null ? (
                    <>
                      <Clock className="h-6 w-6" />
                      Temps écoulé !
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6" />
                      Pas tout à fait...
                    </>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {selectedAnswer === null ? 'La bonne réponse était :' : 'Explication :'}
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedAnswer === null 
                      ? `${String.fromCharCode(65 + currentQuestion.correctAnswer)} - ${currentQuestion.options[currentQuestion.correctAnswer]}. ${currentQuestion.explanation}`
                      : currentQuestion.explanation
                    }
                  </p>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full"
                  size="lg"
                >
                  {isLastQuestion ? 'Voir les résultats' : 'Question suivante'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGame;