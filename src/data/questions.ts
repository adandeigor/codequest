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
  {
    id: 'js_1_4',
    universeId: 'javascript',
    level: 1,
    question: 'Quel opérateur compare la valeur ET le type ?',
    options: ['==', '===', '!=', '!=='],
    correctAnswer: 1,
    explanation: 'L\'opérateur === compare à la fois la valeur et le type.',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_5',
    universeId: 'javascript',
    level: 1,
    question: 'Comment créer un tableau vide en JavaScript ?',
    options: ['[]', 'Array()', 'new Array()', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'Toutes ces syntaxes créent un tableau vide.',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_6',
    universeId: 'javascript',
    level: 1,
    question: 'Que retourne typeof undefined ?',
    options: ['"undefined"', '"null"', '"object"', 'Error'],
    correctAnswer: 0,
    explanation: 'typeof undefined retourne la chaîne "undefined".',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_7',
    universeId: 'javascript',
    level: 1,
    question: 'Comment accéder au premier élément d\'un tableau ?',
    options: ['array[1]', 'array[0]', 'array.first()', 'array.get(0)'],
    correctAnswer: 1,
    explanation: 'Les indices des tableaux commencent à 0 en JavaScript.',
    difficulty: 'beginner'
  },
  {
    id: 'js_1_8',
    universeId: 'javascript',
    level: 1,
    question: 'Quelle méthode ajoute un élément à la fin d\'un tableau ?',
    options: ['push()', 'add()', 'append()', 'insert()'],
    correctAnswer: 0,
    explanation: 'La méthode push() ajoute un ou plusieurs éléments à la fin d\'un tableau.',
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
  {
    id: 'js_2_3',
    universeId: 'javascript',
    level: 2,
    question: 'Que fait la méthode map() ?',
    options: ['Modifie le tableau original', 'Retourne un nouveau tableau transformé', 'Filtre les éléments', 'Trie le tableau'],
    correctAnswer: 1,
    explanation: 'map() retourne un nouveau tableau en appliquant une fonction à chaque élément.',
    difficulty: 'intermediate'
  },
  {
    id: 'js_2_4',
    universeId: 'javascript',
    level: 2,
    question: 'Comment fusionner deux tableaux ?',
    options: ['array1 + array2', '[...array1, ...array2]', 'array1.merge(array2)', 'array1.concat(array2)'],
    correctAnswer: 1,
    explanation: 'Le spread operator (...) est la méthode moderne pour fusionner des tableaux.',
    difficulty: 'intermediate'
  },
  {
    id: 'js_2_5',
    universeId: 'javascript',
    level: 2,
    question: 'Qu\'est-ce que le hoisting ?',
    options: ['Une méthode de tri', 'Le déplacement des déclarations vers le haut', 'Une fonction intégrée', 'Un type de boucle'],
    correctAnswer: 1,
    explanation: 'Le hoisting fait que les déclarations de variables et fonctions sont "remontées" au début de leur portée.',
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
  {
    id: 'react_1_3',
    universeId: 'react',
    level: 1,
    question: 'Que signifie JSX ?',
    options: ['JavaScript XML', 'JavaScript eXtended', 'Java Syntax eXtension', 'JSON eXtension'],
    correctAnswer: 0,
    explanation: 'JSX signifie JavaScript XML et permet d\'écrire du HTML dans JavaScript.',
    difficulty: 'beginner'
  },
  {
    id: 'react_1_4',
    universeId: 'react',
    level: 1,
    question: 'Comment gérer un événement click en React ?',
    options: ['onclick="handleClick"', 'onClick={handleClick}', 'click={handleClick}', 'onPress={handleClick}'],
    correctAnswer: 1,
    explanation: 'En React, on utilise onClick avec des accolades pour passer une fonction.',
    difficulty: 'beginner'
  },
  {
    id: 'react_1_5',
    universeId: 'react',
    level: 1,
    question: 'Quel hook utilise-t-on pour des effets de bord ?',
    options: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    correctAnswer: 1,
    explanation: 'useEffect est utilisé pour gérer les effets de bord comme les appels API.',
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
  {
    id: 'python_1_3',
    universeId: 'python',
    level: 1,
    question: 'Comment commenter une ligne en Python ?',
    options: ['// commentaire', '/* commentaire */', '# commentaire', '<!-- commentaire -->'],
    correctAnswer: 2,
    explanation: 'Le symbole # est utilisé pour les commentaires sur une ligne en Python.',
    difficulty: 'beginner'
  },
  {
    id: 'python_1_4',
    universeId: 'python',
    level: 1,
    question: 'Quel type de données représente "Hello World" ?',
    options: ['int', 'float', 'str', 'bool'],
    correctAnswer: 2,
    explanation: 'Les chaînes de caractères sont de type str en Python.',
    difficulty: 'beginner'
  },
  {
    id: 'python_1_5',
    universeId: 'python',
    level: 1,
    question: 'Comment obtenir la longueur d\'une liste ?',
    options: ['list.length', 'len(list)', 'list.size()', 'length(list)'],
    correctAnswer: 1,
    explanation: 'La fonction len() retourne la longueur d\'une liste en Python.',
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
  {
    id: 'ts_1_2',
    universeId: 'typescript',
    level: 1,
    question: 'Quel est l\'avantage principal de TypeScript ?',
    options: ['Plus rapide que JavaScript', 'Typage statique', 'Plus petit en taille', 'Fonctionne sans compilation'],
    correctAnswer: 1,
    explanation: 'TypeScript ajoute le typage statique à JavaScript, permettant de détecter les erreurs tôt.',
    difficulty: 'beginner'
  },
  {
    id: 'ts_1_3',
    universeId: 'typescript',
    level: 1,
    question: 'Comment définir une interface en TypeScript ?',
    options: ['class User {}', 'interface User {}', 'type User = {}', 'B et C sont correctes'],
    correctAnswer: 3,
    explanation: 'On peut utiliser interface ou type pour définir des structures en TypeScript.',
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
  {
    id: 'css_1_2',
    universeId: 'css',
    level: 1,
    question: 'Comment centrer un élément horizontalement avec Flexbox ?',
    options: ['align-items: center', 'justify-content: center', 'text-align: center', 'margin: auto'],
    correctAnswer: 1,
    explanation: 'justify-content: center centre les éléments horizontalement dans un conteneur flex.',
    difficulty: 'beginner'
  },
  {
    id: 'css_1_3',
    universeId: 'css',
    level: 1,
    question: 'Quelle unité CSS est relative à la taille de la police du parent ?',
    options: ['px', 'em', 'rem', 'vh'],
    correctAnswer: 1,
    explanation: 'em est relative à la taille de police de l\'élément parent.',
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
  {
    id: 'sql_1_2',
    universeId: 'sql',
    level: 1,
    question: 'Comment filtrer les résultats dans une requête SQL ?',
    options: ['FILTER', 'WHERE', 'HAVING', 'IF'],
    correctAnswer: 1,
    explanation: 'WHERE est utilisé pour filtrer les lignes dans une requête SQL.',
    difficulty: 'beginner'
  },
  {
    id: 'sql_1_3',
    universeId: 'sql',
    level: 1,
    question: 'Quelle commande insère de nouvelles données ?',
    options: ['ADD', 'INSERT', 'CREATE', 'PUT'],
    correctAnswer: 1,
    explanation: 'INSERT INTO est utilisé pour insérer de nouvelles données dans une table.',
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
  {
    id: 'docker_1_2',
    universeId: 'docker',
    level: 1,
    question: 'Comment construire une image Docker ?',
    options: ['docker create', 'docker build', 'docker make', 'docker compile'],
    correctAnswer: 1,
    explanation: 'docker build construit une image à partir d\'un Dockerfile.',
    difficulty: 'beginner'
  },

  // Git - Level 1
  {
    id: 'git_1_1',
    universeId: 'git',
    level: 1,
    question: 'Quelle commande clone un dépôt Git ?',
    options: ['git copy', 'git clone', 'git download', 'git get'],
    correctAnswer: 1,
    explanation: 'git clone télécharge une copie complète d\'un dépôt Git.',
    difficulty: 'beginner'
  },
  {
    id: 'git_1_2',
    universeId: 'git',
    level: 1,
    question: 'Comment valider des changements ?',
    options: ['git save', 'git commit', 'git push', 'git validate'],
    correctAnswer: 1,
    explanation: 'git commit enregistre les changements dans l\'historique du dépôt.',
    difficulty: 'beginner'
  },

  // NodeJS - Level 1
  {
    id: 'nodejs_1_1',
    universeId: 'nodejs',
    level: 1,
    question: 'Comment installer un package avec npm ?',
    options: ['npm get package', 'npm install package', 'npm add package', 'npm download package'],
    correctAnswer: 1,
    explanation: 'npm install est la commande pour installer des packages Node.js.',
    difficulty: 'beginner'
  },
  {
    id: 'nodejs_1_2',
    universeId: 'nodejs',
    level: 1,
    question: 'Quel fichier contient les métadonnées d\'un projet Node.js ?',
    options: ['config.json', 'package.json', 'project.json', 'node.json'],
    correctAnswer: 1,
    explanation: 'package.json contient les métadonnées et dépendances du projet.',
    difficulty: 'beginner'
  },

  // Advanced questions for higher levels
  {
    id: 'js_3_1',
    universeId: 'javascript',
    level: 3,
    question: 'Que fait le code suivant: [...new Set([1,2,2,3,3,3])] ?',
    options: ['Crée un array avec des doublons', 'Supprime les doublons du array', 'Trie le array', 'Lève une erreur'],
    correctAnswer: 1,
    explanation: 'Set supprime les doublons, et ... convertit le Set en array.',
    difficulty: 'advanced'
  },
  {
    id: 'js_3_2',
    universeId: 'javascript',
    level: 3,
    question: 'Qu\'est-ce qu\'une closure en JavaScript ?',
    options: ['Une fonction fermée', 'Une fonction qui accède à des variables de sa portée externe', 'Une fonction anonyme', 'Une méthode de classe'],
    correctAnswer: 1,
    explanation: 'Une closure permet à une fonction d\'accéder aux variables de sa portée lexicale externe.',
    difficulty: 'advanced'
  },
  {
    id: 'js_4_1',
    universeId: 'javascript',
    level: 4,
    question: 'Que fait Promise.all() ?',
    options: ['Exécute les promesses en séquence', 'Attend que toutes les promesses se résolvent', 'Prend la première promesse résolue', 'Annule toutes les promesses'],
    correctAnswer: 1,
    explanation: 'Promise.all() attend que toutes les promesses se résolvent et retourne un tableau des résultats.',
    difficulty: 'advanced'
  },
  {
    id: 'react_2_1',
    universeId: 'react',
    level: 2,
    question: 'Quelle est la différence entre useCallback et useMemo ?',
    options: ['Aucune différence', 'useCallback mémorise des fonctions, useMemo des valeurs', 'useMemo mémorise des fonctions, useCallback des valeurs', 'Ils font la même chose'],
    correctAnswer: 1,
    explanation: 'useCallback mémorise des fonctions pour éviter les re-créations, useMemo mémorise des valeurs calculées.',
    difficulty: 'intermediate'
  },
  {
    id: 'react_2_2',
    universeId: 'react',
    level: 2,
    question: 'Comment éviter les re-renders inutiles ?',
    options: ['React.memo', 'useCallback', 'useMemo', 'Toutes les réponses'],
    correctAnswer: 3,
    explanation: 'React.memo, useCallback et useMemo peuvent tous aider à éviter les re-renders inutiles.',
    difficulty: 'intermediate'
  },
  {
    id: 'python_2_1',
    universeId: 'python',
    level: 2,
    question: 'Que fait list comprehension [x*2 for x in range(5)] ?',
    options: ['[0, 2, 4, 6, 8]', '[2, 4, 6, 8, 10]', '[0, 1, 2, 3, 4]', 'Erreur de syntaxe'],
    correctAnswer: 0,
    explanation: 'Cette compréhension de liste multiplie chaque nombre de 0 à 4 par 2.',
    difficulty: 'intermediate'
  },
  {
    id: 'python_2_2',
    universeId: 'python',
    level: 2,
    question: 'Quelle est la différence entre == et is ?',
    options: ['Aucune différence', '== compare les valeurs, is compare l\'identité', 'is compare les valeurs, == compare l\'identité', 'Ils sont identiques'],
    correctAnswer: 1,
    explanation: '== compare les valeurs tandis que is compare l\'identité des objets en mémoire.',
    difficulty: 'intermediate'
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