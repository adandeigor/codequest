import initSqlJs from 'sql.js';

export interface PlayerData {
  id: number;
  name: string;
  level: number;
  experience: number;
  crystalsCollected: number;
  totalScore: number;
  lastPlayed: string;
}

export interface Crystal {
  id: string;
  type: 'blue' | 'purple' | 'pink' | 'gold' | 'green';
  value: number;
  position: [number, number, number];
  collected: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
}

class GameDatabase {
  private db: any = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('crystalquest_db');
      
      if (savedDb) {
        try {
          const uint8Array = new Uint8Array(JSON.parse(savedDb));
          this.db = new SQL.Database(uint8Array);
          console.log('Loaded existing database from localStorage');
        } catch (error) {
          console.log('Failed to load saved database, creating new one');
          this.db = new SQL.Database();
          this.createTables();
          this.initializeDefaultData();
        }
      } else {
        console.log('Creating new database');
        this.db = new SQL.Database();
        this.createTables();
        this.initializeDefaultData();
      }

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private createTables() {
    // Player table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS player (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        crystalsCollected INTEGER DEFAULT 0,
        totalScore INTEGER DEFAULT 0,
        lastPlayed TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crystals table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS crystals (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        value INTEGER NOT NULL,
        positionX REAL NOT NULL,
        positionY REAL NOT NULL,
        positionZ REAL NOT NULL,
        collected INTEGER DEFAULT 0
      )
    `);

    // Achievements table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        requirement INTEGER NOT NULL,
        unlocked INTEGER DEFAULT 0,
        unlockedAt TEXT
      )
    `);
  }

  private initializeDefaultData() {
    // Create default player
    this.db.run(`
      INSERT INTO player (name, level, experience, crystalsCollected, totalScore)
      VALUES ('Explorer', 1, 0, 0, 0)
    `);

    // Generate initial crystals
    this.generateCrystals();

    // Create achievements
    const achievements = [
      { id: 'first_crystal', name: 'First Crystal', description: 'Collect your first crystal', requirement: 1 },
      { id: 'crystal_hunter', name: 'Crystal Hunter', description: 'Collect 10 crystals', requirement: 10 },
      { id: 'crystal_master', name: 'Crystal Master', description: 'Collect 50 crystals', requirement: 50 },
      { id: 'level_up', name: 'Level Up!', description: 'Reach level 2', requirement: 2 },
      { id: 'experienced', name: 'Experienced', description: 'Reach level 5', requirement: 5 },
      { id: 'score_milestone', name: 'Score Milestone', description: 'Reach 1000 points', requirement: 1000 }
    ];

    achievements.forEach(achievement => {
      this.db.run(`
        INSERT INTO achievements (id, name, description, requirement)
        VALUES (?, ?, ?, ?)
      `, [achievement.id, achievement.name, achievement.description, achievement.requirement]);
    });
  }

  private generateCrystals() {
    const crystalTypes = ['blue', 'purple', 'pink', 'gold', 'green'];
    const crystalValues = { blue: 10, purple: 25, pink: 50, gold: 100, green: 15 };

    for (let i = 0; i < 30; i++) {
      const type = crystalTypes[Math.floor(Math.random() * crystalTypes.length)] as keyof typeof crystalValues;
      const value = crystalValues[type];
      const position = [
        (Math.random() - 0.5) * 20, // x: -10 to 10
        Math.random() * 5 + 1,      // y: 1 to 6
        (Math.random() - 0.5) * 20  // z: -10 to 10
      ];

      this.db.run(`
        INSERT INTO crystals (id, type, value, positionX, positionY, positionZ)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [`crystal_${i}`, type, value, position[0], position[1], position[2]]);
    }
  }

  async getPlayerData(): Promise<PlayerData | null> {
    await this.init();
    const stmt = this.db.prepare('SELECT * FROM player WHERE id = 1');
    const result = stmt.getAsObject();
    stmt.free();
    return result as PlayerData || null;
  }

  async updatePlayerData(updates: Partial<PlayerData>) {
    await this.init();
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    this.db.run(`UPDATE player SET ${setClause}, lastPlayed = CURRENT_TIMESTAMP WHERE id = 1`, values);
    this.saveToLocalStorage();
  }

  async getCrystals(): Promise<Crystal[]> {
    await this.init();
    const stmt = this.db.prepare('SELECT * FROM crystals WHERE collected = 0');
    const crystals: Crystal[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      crystals.push({
        id: row.id as string,
        type: row.type as Crystal['type'],
        value: row.value as number,
        position: [row.positionX as number, row.positionY as number, row.positionZ as number],
        collected: false
      });
    }
    
    stmt.free();
    return crystals;
  }

  async collectCrystal(crystalId: string): Promise<void> {
    await this.init();
    this.db.run('UPDATE crystals SET collected = 1 WHERE id = ?', [crystalId]);
    this.saveToLocalStorage();
  }

  async getAchievements(): Promise<Achievement[]> {
    await this.init();
    const stmt = this.db.prepare('SELECT * FROM achievements');
    const achievements: Achievement[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      achievements.push({
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        requirement: row.requirement as number,
        unlocked: Boolean(row.unlocked),
        unlockedAt: row.unlockedAt as string
      });
    }
    
    stmt.free();
    return achievements;
  }

  async unlockAchievement(achievementId: string): Promise<void> {
    await this.init();
    this.db.run(
      'UPDATE achievements SET unlocked = 1, unlockedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [achievementId]
    );
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    const data = this.db.export();
    localStorage.setItem('crystalquest_db', JSON.stringify(Array.from(data)));
  }

  async resetGame(): Promise<void> {
    await this.init();
    this.db.run('DELETE FROM player');
    this.db.run('DELETE FROM crystals');
    this.db.run('DELETE FROM achievements');
    this.initializeDefaultData();
    this.saveToLocalStorage();
  }
}

export const gameDatabase = new GameDatabase();