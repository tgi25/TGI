import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { Question, AssessmentResult } from '../types';
import { Loader2, CheckCircle, XCircle, SkipForward, RefreshCw, Trophy, AlertCircle } from 'lucide-react';

interface AnswerHistory {
    questionId: string;
    status: 'CORRECT' | 'INCORRECT' | 'SKIPPED';
}

const Assessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState<AnswerHistory[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    setShowSummary(false);
    setHistory([]);
    setCurrentQuestionIndex(0);
    setResult(null);

    try {
      const generated = await generateQuizQuestions();
      if (generated && generated.length > 0) {
        setQuestions(generated);
      } else {
        // Fallback hardcoded questions if AI fails or no key
        setQuestions([
            {
                id: 'static_1',
                type: 'MCQ',
                text: 'What is the average Time Complexity of Bubble Sort?',
                options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'],
                correctOptionIndex: 2,
                context: 'Bubble sort runs in O(N^2) time because of nested loops.'
            },
            {
                id: 'static_2',
                type: 'MCQ',
                text: 'In the first pass of Bubble Sort on an array of size N, how many comparisons are made?',
                options: ['N', 'N - 1', 'N / 2', 'N * N'],
                correctOptionIndex: 1,
                context: 'In the first pass, we compare indices 0 vs 1, 1 vs 2, ... up to N-2 vs N-1. This is N-1 comparisons.'
            },
             {
                id: 'static_3',
                type: 'MCQ',
                text: 'Is Bubble Sort a stable sorting algorithm?',
                options: ['Yes', 'No', 'Only for integers', 'Only for small arrays'],
                correctOptionIndex: 0,
                context: 'Yes, Bubble Sort is stable because it only swaps adjacent elements if the left one is strictly greater than the right one. Equal elements are not swapped.'
            }
        ]);
        if (process.env.API_KEY) {
             console.warn("Using fallback questions despite API Key being present. Check generation logic.");
        }
      }
    } catch (err) {
      setError("Failed to load AI questions. Using standard set.");
    } finally {
      setLoading(false);
    }
  };

  const handleMCQSubmit = (optionIndex: number) => {
    if (result) return; // Prevent answering twice

    const question = questions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correctOptionIndex;
    
    setResult({
      questionId: question.id,
      isCorrect,
      userAnswer: question.options ? question.options[optionIndex] : '',
      feedback: isCorrect 
        ? "Correct! Well done." 
        : `Incorrect. The correct answer is: ${question.options ? question.options[question.correctOptionIndex || 0] : ''}`
    });

    setHistory(prev => [...prev, {
        questionId: question.id,
        status: isCorrect ? 'CORRECT' : 'INCORRECT'
    }]);
  };

  const handleSkip = () => {
      if (result) return; // Prevent skipping after answering

      const question = questions[currentQuestionIndex];
      setResult({
          questionId: question.id,
          isCorrect: false, // Not technically correct or incorrect for score, but UI needs something
          feedback: `Skipped. The correct answer was: ${question.options ? question.options[question.correctOptionIndex || 0] : ''}`,
          userAnswer: "Skipped"
      });

      setHistory(prev => [...prev, {
          questionId: question.id,
          status: 'SKIPPED'
      }]);
  };

  const nextQuestion = () => {
    setResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const calculateScore = () => {
      const correctCount = history.filter(h => h.status === 'CORRECT').length;
      const incorrectCount = history.filter(h => h.status === 'INCORRECT').length;
      
      let score = correctCount * 1;
      
      // Negative marking rule: -1/3 for each incorrect answer ONLY IF incorrect answers > 2
      if (incorrectCount > 2) {
          score -= (incorrectCount * (1/3));
      }

      return {
          score: Math.max(0, score), // Assuming score shouldn't be negative total, or maybe it can be? Let's keep it raw but allow negative. Actually usually exams floor at 0. Let's keep exact calc.
          rawScore: score,
          correctCount,
          incorrectCount,
          skippedCount: history.filter(h => h.status === 'SKIPPED').length
      };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="animate-spin text-maroon-800 mb-4" size={48} />
        <p className="text-gray-600 font-medium">Generating 20 questions...</p>
      </div>
    );
  }

  if (showSummary) {
      const stats = calculateScore();
      return (
        <div className="max-w-2xl mx-auto p-8 h-full flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full border border-gray-100 text-center">
                <div className="w-20 h-20 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="text-maroon-800 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-gray-500 mb-8">Here is how you performed based on the Bubble Sort criteria.</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="text-2xl font-bold text-green-700">{stats.correctCount}</div>
                        <div className="text-xs text-green-600 font-medium uppercase tracking-wide">Correct</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="text-2xl font-bold text-red-700">{stats.incorrectCount}</div>
                        <div className="text-xs text-red-600 font-medium uppercase tracking-wide">Incorrect</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-gray-700">{stats.skippedCount}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Skipped</div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 text-white mb-8">
                    <div className="text-sm text-slate-400 mb-1">Final Score</div>
                    <div className="text-4xl font-bold">{stats.rawScore.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 mt-2">
                        (+1 Correct) | (-0.33 Incorrect if {'>'} 2 errors)
                    </div>
                </div>

                <button
                    onClick={loadQuestions}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-maroon-800 text-white rounded-lg hover:bg-maroon-700 transition-all font-medium shadow-md"
                >
                    <RefreshCw size={20} />
                    Take New Quiz
                </button>
            </div>
        </div>
      );
  }

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Knowledge Check</h2>
        <span className="bg-maroon-100 text-maroon-800 px-3 py-1 rounded-full text-sm font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            {question.text}
          </h3>

          <div className="grid gap-4">
              {question.options?.map((option, idx) => {
                  let buttonStyle = "border-gray-100 hover:border-maroon-200 hover:bg-maroon-50 text-gray-700";
                  
                  // Visual feedback logic
                  if (result) {
                      if (result.isCorrect && idx === question.correctOptionIndex) {
                          buttonStyle = "bg-green-100 border-green-500 text-green-900";
                      } else if (!result.isCorrect && result.userAnswer !== "Skipped" && idx === question.options?.indexOf(result.userAnswer)) {
                          buttonStyle = "bg-red-100 border-red-500 text-red-900";
                      } else if (idx === question.correctOptionIndex) {
                           buttonStyle = "bg-green-50 border-green-300 text-green-800 opacity-70"; // Show correct answer if wrong/skipped
                      } else {
                          buttonStyle = "border-gray-100 opacity-50";
                      }
                  }

                  return (
                    <button
                        key={idx}
                        onClick={() => handleMCQSubmit(idx)}
                        disabled={!!result}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-start gap-3 ${buttonStyle}`}
                    >
                        <span className="inline-block font-bold mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                        <span>{option}</span>
                    </button>
                  );
              })}
            </div>

          {/* Feedback Section */}
          {result && (
            <div className={`mt-6 p-6 rounded-xl border-l-4 animate-fade-in ${
               result.userAnswer === 'Skipped' 
               ? 'bg-gray-50 border-gray-400' 
               : result.isCorrect 
                 ? 'bg-green-50 border-green-500' 
                 : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                 {result.userAnswer === 'Skipped' ? (
                     <SkipForward className="text-gray-600 mt-1" />
                 ) : result.isCorrect ? (
                     <CheckCircle className="text-green-600 mt-1" />
                 ) : (
                     <XCircle className="text-red-600 mt-1" />
                 )}
                
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-line">{result.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
            {!result ? (
                 <button
                 onClick={handleSkip}
                 className="px-6 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-medium flex items-center gap-2"
               >
                 Skip Question <SkipForward size={18} />
               </button>
            ) : (
                <div></div> // Spacer
            )}
         
          {result && (
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-lg ml-auto"
            >
              {isLastQuestion ? 'View Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;