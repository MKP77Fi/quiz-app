/**
 * Fisher-Yates shuffle algoritmi
 * Sekoittaa taulukon satunnaiseen järjestykseen
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sekoittaa kysymykset ja niiden vastausvaihtoehdot
 */
export function shuffleQuestions(questions) {
  return shuffleArray(questions).map(question => ({
    ...question,
    options: shuffleArray(question.options)
  }));
}