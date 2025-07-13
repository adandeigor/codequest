import { Question } from '@/types/game';

export const questions: Question[] = [
  // JavaScript - Level 1 (Beginner)
  {
    id: 'js_1_1',
    universeId: 'javascript',
    level: 1,
    question: 'Quel est le type de données pour les nombres entiers en JavaScript ?',
    options: ['int', 'integer', 'number', 'float'],
    correctAnswer: 2,
    explanation: 'JavaScript utilise le type "number" pour tous les nombres, entiers et décimaux.',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_2',
    universeId: 'javascript',
    level: 1,
    question: 'Comment déclare-t-on une variable en JavaScript (ES6+) ?',
    options: ['var x = 5', 'let x = 5', 'const x = 5', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'En ES6+, on peut utiliser var, let ou const selon le besoin de mutabilité.',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_3',
    universeId: 'javascript',
    level: 1,
    question: 'Quelle méthode affiche du texte dans la console ?',
    options: ['console.print()', 'console.log()', 'console.write()', 'print()'],
    correctAnswer: 1,
    explanation: 'console.log() est la méthode standard pour afficher du texte dans la console.',
    difficulty: 'beginner'
  },

  // JavaScript - Level 2 (Intermediate)
  {
    id: 'js_2_1',
    universeId: 'javascript',
    level: 2,
    question: 'Que retourne "typeof null" en JavaScript ?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
    explanation: 'C\'est un bug historique de JavaScript, typeof null retourne "object".',
    difficulty: 'intermediate'
  },
  {
    id: 'js_2_2',
    universeId: 'javascript',
    level: 2,
    question: 'Comment créer une fonction fléchée qui retourne le carré d\'un nombre ?',
    options: ['x => x * x', 'function(x) { return x * x }', '(x) => { return x * x }', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'Toutes ces syntaxes sont valides pour créer une fonction qui retourne le carré.',
    difficulty: 'intermediate'
  },

  // React - Level 1
  {
    id: 'react_1_1',
    universeId: 'react',
    level: 1,
    question: 'Quel hook utilise-t-on pour gérer l\'état local dans un composant fonctionnel ?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1,
    explanation: 'useState est le hook principal pour gérer l\'état local dans les composants fonctionnels.',
    difficulty: 'beginner'
  },
  {
    id: 'react_1_2',
    universeId: 'react',
    level: 1,
    question: 'Comment passer des données d\'un composant parent à un composant enfant ?',
    options: ['Avec des props', 'Avec useState', 'Avec useEffect', 'Avec des variables globales'],
    correctAnswer: 0,
    explanation: 'Les props permettent de passer des données du parent vers l\'enfant.',
    difficulty: 'beginner'
  },

  // Python - Level 1
  {
    id: 'python_1_1',
    universeId: 'python',
    level: 1,
    question: 'Comment créer une liste vide en Python ?',
    options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
    correctAnswer: 0,
    explanation: 'Les crochets [] créent une liste vide en Python.',
    difficulty: 'beginner'
  },
  {
    id: 'python_1_2',
    universeId: 'python',
    level: 1,
    question: 'Quelle fonction utilise-t-on pour afficher du texte en Python ?',
    options: ['console.log()', 'echo()', 'print()', 'write()'],
    correctAnswer: 2,
    explanation: 'print() est la fonction standard pour afficher du texte en Python.',
    difficulty: 'beginner'
  },

  // TypeScript - Level 1
  {
    id: 'ts_1_1',
    universeId: 'typescript',
    level: 1,
    question: 'Comment déclarer une variable avec un type explicite en TypeScript ?',
    options: ['let x: number = 5', 'let x = 5: number', 'number x = 5', 'let x<number> = 5'],
    correctAnswer: 0,
    explanation: 'En TypeScript, on déclare le type après le nom de la variable avec ":".',
    difficulty: 'beginner'
  },

  // CSS - Level 1
  {
    id: 'css_1_1',
    universeId: 'css',
    level: 1,
    question: 'Quelle propriété CSS change la couleur du texte ?',
    options: ['text-color', 'font-color', 'color', 'text-style'],
    correctAnswer: 2,
    explanation: 'La propriété "color" définit la couleur du texte en CSS.',
    difficulty: 'beginner'
  },

  // SQL - Level 1
  {
    id: 'sql_1_1',
    universeId: 'sql',
    level: 1,
    question: 'Quelle commande SQL sélectionne toutes les colonnes d\'une table ?',
    options: ['SELECT ALL FROM table', 'SELECT * FROM table', 'GET * FROM table', 'FETCH * FROM table'],
    correctAnswer: 1,
    explanation: 'SELECT * FROM table sélectionne toutes les colonnes d\'une table.',
    difficulty: 'beginner'
  },

  // Docker - Level 1
  {
    id: 'docker_1_1',
    universeId: 'docker',
    level: 1,
    question: 'Quelle commande permet de lister les conteneurs Docker en cours d\'exécution ?',
    options: ['docker list', 'docker ps', 'docker show', 'docker containers'],
    correctAnswer: 1,
    explanation: 'docker ps affiche la liste des conteneurs en cours d\'exécution.',
    difficulty: 'beginner'
  },

  // Advanced questions for higher levels
  {
    id: 'js_5_1',
    universeId: 'javascript',
    level: 5,
    question: 'Que fait le code suivant: [...new Set([1,2,2,3,3,3])] ?',
    options: ['Crée un array avec des doublons', 'Supprime les doublons du array', 'Trie le array', 'Lève une erreur'],
    correctAnswer: 1,
    explanation: 'Set supprime les doublons, et ... convertit le Set en array.',
    difficulty: 'advanced'
  },

  {
    id: 'react_3_1',
    universeId: 'react',
    level: 3,
    question: 'Quelle est la différence entre useCallback et useMemo ?',
    options: ['Aucune différence', 'useCallback mémorise des fonctions, useMemo des valeurs', 'useMemo mémorise des fonctions, useCallback des valeurs', 'Ils font la même chose'],
    correctAnswer: 1,
    explanation: 'useCallback mémorise des fonctions pour éviter les re-créations, useMemo mémorise des valeurs calculées.',
    difficulty: 'advanced'
  }
];

// Fonction pour générer plus de questions automatiquement
export const generateAdditionalQuestions = (universeId: string, level: number): Question[] => {
  const baseQuestions: Partial<Question>[] = [];
  
  // Questions génériques par universe
  const questionTemplates = {
    javascript: [
      { question: 'Quelle est la sortie de console.log(1 + "1") ?', options: ['2', '"11"', '11', 'NaN'], correctAnswer: 1 },
      { question: 'Comment vérifier si une variable est un array ?', options: ['typeof arr === "array"', 'Array.isArray(arr)', 'arr instanceof Array', 'B et C sont correctes'], correctAnswer: 3 }
    ],
    python: [
      { question: 'Comment créer un dictionnaire vide ?', options: ['{}', 'dict()', 'Les deux', 'Aucune'], correctAnswer: 2 },
      { question: 'Que fait la méthode .append() ?', options: ['Supprime un élément', 'Ajoute un élément à la fin', 'Trie la liste', 'Inverse la liste'], correctAnswer: 1 }
    ],
    react: [
      { question: 'Quand useEffect se déclenche-t-il par défaut ?', options: ['Au montage seulement', 'À chaque render', 'Au démontage seulement', 'Jamais'], correctAnswer: 1 },
      { question: 'Comment éviter les re-renders inutiles ?', options: ['React.memo', 'useCallback', 'useMemo', 'Toutes les réponses'], correctAnswer: 3 }
    ]
  };

  const templates = questionTemplates[universeId as keyof typeof questionTemplates] || [];
  
  return templates.map((template, index) => ({
    id: `${universeId}_${level}_gen_${index}`,
    universeId,
    level,
    difficulty: level <= 2 ? 'beginner' : level <= 5 ? 'intermediate' : level <= 8 ? 'advanced' : 'expert',
    explanation: 'Explication générée automatiquement.',
    ...template
  } as Question));
};