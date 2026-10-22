import { Question } from '../chapters/types';
import { grade } from './grade';

const QUESTIONS: Question[] = [
  {
    prompt: 'Primeira?',
    alternatives: [
      { text: 'Certa', correct: true, explanation: 'Isso: é a certa.' },
      { text: 'Errada', explanation: 'Não: esta é a errada.' },
    ],
  },
  {
    prompt: 'Segunda?',
    alternatives: [
      { text: 'Errada', explanation: 'Quase: esta não.' },
      { text: 'Certa', correct: true, explanation: 'Exato.' },
    ],
  },
];

describe('grade', () => {
  it('all correct → allCorrect true and each feedback is the chosen alternative explanation', () => {
    expect(grade(QUESTIONS, [0, 1])).toEqual({
      allCorrect: true,
      correctCount: 2,
      items: [
        { correct: true, feedback: 'Isso: é a certa.' },
        { correct: true, feedback: 'Exato.' },
      ],
    });
  });

  it('a wrong answer → correct false and feedback is the wrong alternative explanation', () => {
    const result = grade(QUESTIONS, [1, 1]);
    expect(result.allCorrect).toBe(false);
    expect(result.correctCount).toBe(1);
    expect(result.items[0]).toEqual({ correct: false, feedback: 'Não: esta é a errada.' });
  });

  it('null answer → correct false and feedback "Escolha uma alternativa."', () => {
    const result = grade(QUESTIONS, [0, null]);
    expect(result.allCorrect).toBe(false);
    expect(result.items[1]).toEqual({ correct: false, feedback: 'Escolha uma alternativa.' });
  });

  it('missing answers count as unanswered', () => {
    expect(grade(QUESTIONS, [0]).items[1].feedback).toBe('Escolha uma alternativa.');
  });
});
