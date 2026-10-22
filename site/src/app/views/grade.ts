import { Question } from '../chapters/types';

export interface Grading {
  allCorrect: boolean;
  correctCount: number;
  items: { correct: boolean; feedback: string }[];
}

/** Corrige o desafio. Cada resposta é o índice da alternativa escolhida, ou null se ficou em branco. */
export function grade(questions: Question[], answers: (number | null)[]): Grading {
  const items = questions.map((question, index) => {
    const answer = answers[index] ?? null;
    const chosen = answer === null ? undefined : question.alternatives[answer];
    if (!chosen) return { correct: false, feedback: 'Escolha uma alternativa.' };
    return { correct: chosen.correct === true, feedback: chosen.explanation };
  });
  const correctCount = items.filter((item) => item.correct).length;
  return { allCorrect: correctCount === questions.length, correctCount, items };
}
