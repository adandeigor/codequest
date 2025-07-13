import { Universe } from '@/types/game';

export const universes: Universe[] = [
  // Web Development
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    description: 'Master the language of the web',
    color: '#F7DF1E',
    category: 'web',
    totalLevels: 10
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    description: 'JavaScript with types',
    color: '#3178C6',
    category: 'web',
    totalLevels: 8
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    description: 'Build user interfaces',
    color: '#61DAFB',
    category: 'web',
    totalLevels: 12
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: '💚',
    description: 'Progressive JavaScript framework',
    color: '#4FC08D',
    category: 'web',
    totalLevels: 10
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🅰️',
    description: 'Platform for web applications',
    color: '#DD0031',
    category: 'web',
    totalLevels: 10
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: '🟩',
    description: 'JavaScript runtime environment',
    color: '#339933',
    category: 'web',
    totalLevels: 9
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    description: 'React production framework',
    color: '#000000',
    category: 'web',
    totalLevels: 8
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '🎨',
    description: 'Style the web',
    color: '#1572B6',
    category: 'web',
    totalLevels: 8
  },

  // Mobile Development
  {
    id: 'react-native',
    name: 'React Native',
    icon: '📱',
    description: 'Cross-platform mobile apps',
    color: '#61DAFB',
    category: 'mobile',
    totalLevels: 10
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: '🐦',
    description: 'Google\'s UI toolkit',
    color: '#02569B',
    category: 'mobile',
    totalLevels: 10
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: '🍎',
    description: 'iOS development',
    color: '#FA7343',
    category: 'mobile',
    totalLevels: 12
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '🤖',
    description: 'Android development',
    color: '#7F52FF',
    category: 'mobile',
    totalLevels: 12
  },

  // Data Science & Analytics
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'The versatile language',
    color: '#3776AB',
    category: 'data',
    totalLevels: 15
  },
  {
    id: 'pandas',
    name: 'Pandas',
    icon: '🐼',
    description: 'Data manipulation and analysis',
    color: '#150458',
    category: 'data',
    totalLevels: 8
  },
  {
    id: 'numpy',
    name: 'NumPy',
    icon: '🔢',
    description: 'Numerical computing',
    color: '#013243',
    category: 'data',
    totalLevels: 6
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: '🗄️',
    description: 'Database queries',
    color: '#336791',
    category: 'data',
    totalLevels: 10
  },
  {
    id: 'r',
    name: 'R',
    icon: '📊',
    description: 'Statistical computing',
    color: '#276DC3',
    category: 'data',
    totalLevels: 8
  },

  // AI & Machine Learning
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    icon: '🧠',
    description: 'Machine learning platform',
    color: '#FF6F00',
    category: 'ai',
    totalLevels: 10
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    icon: '🔥',
    description: 'Deep learning framework',
    color: '#EE4C2C',
    category: 'ai',
    totalLevels: 10
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    icon: '🔬',
    description: 'Machine learning library',
    color: '#F7931E',
    category: 'ai',
    totalLevels: 8
  },

  // Systems & Backend
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Enterprise programming',
    color: '#ED8B00',
    category: 'systems',
    totalLevels: 12
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: '🔷',
    description: 'Microsoft\'s language',
    color: '#239120',
    category: 'systems',
    totalLevels: 12
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    description: 'Google\'s systems language',
    color: '#00ADD8',
    category: 'systems',
    totalLevels: 10
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    description: 'Systems programming',
    color: '#000000',
    category: 'systems',
    totalLevels: 12
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚡',
    description: 'High-performance programming',
    color: '#00599C',
    category: 'systems',
    totalLevels: 15
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: '🐳',
    description: 'Containerization platform',
    color: '#0db7ed',
    category: 'systems',
    totalLevels: 6
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: '☸️',
    description: 'Container orchestration',
    color: '#326ce5',
    category: 'systems',
    totalLevels: 8
  },

  // Game Development
  {
    id: 'unity',
    name: 'Unity',
    icon: '🎮',
    description: 'Game development engine',
    color: '#000000',
    category: 'game',
    totalLevels: 10
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    icon: '🎯',
    description: 'Epic\'s game engine',
    color: '#0E1128',
    category: 'game',
    totalLevels: 12
  }
];