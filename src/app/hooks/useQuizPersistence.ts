import { useEffect, useState } from "react";

const QUIZ_STORAGE_KEY = "outfevibe_quiz_state";

export interface QuizState {
  currentStep: number;
  answers: Record<number, string | string[]>;
  persona: string | null;
  completedAt: string | null;
}

const defaultState: QuizState = {
  currentStep: 0,
  answers: {},
  persona: null,
  completedAt: null,
};

export function useQuizPersistence() {
  const [quizState, setQuizState] = useState<QuizState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setQuizState(parsed);
      }
    } catch (e) {
      console.error("Failed to restore quiz state:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizState));
  }, [quizState, isHydrated]);

  const setStep = (step: number) =>
    setQuizState((prev) => ({ ...prev, currentStep: step }));

  const setAnswer = (questionIndex: number, answer: string | string[]) =>
    setQuizState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer },
    }));

  const setPersona = (persona: string) =>
    setQuizState((prev) => ({
      ...prev,
      persona,
      completedAt: new Date().toISOString(),
    }));

  const resetQuiz = () => {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    setQuizState(defaultState);
  };

  return {
    quizState,
    isHydrated,
    setStep,
    setAnswer,
    setPersona,
    resetQuiz,
  };
}