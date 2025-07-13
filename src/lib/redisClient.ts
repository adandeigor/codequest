// Redis client configuration
// Note: This is a local implementation that will be replaced with actual Redis

interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

const REDIS_CONFIG: RedisConfig = {
  host: 'redis-18103.c276.us-east-1-2.ec2.redns.redis-cloud.com',
  port: 18103,
  password: 'oNgEwtXW1MlQ16t3D1xF4q0jlzOSxp9w'
};

// Local storage simulation for now - will be replaced with actual Redis
class LocalRedisClient {
  private storage: { [key: string]: string } = {};

  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.storage[key] = value;
    if (ttl) {
      setTimeout(() => {
        delete this.storage[key];
      }, ttl * 1000);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.storage[key] || null;
  }

  async del(key: string): Promise<void> {
    delete this.storage[key];
  }

  async exists(key: string): Promise<boolean> {
    return key in this.storage;
  }

  async hset(hash: string, field: string, value: string): Promise<void> {
    const hashKey = `${hash}:${field}`;
    this.storage[hashKey] = value;
  }

  async hget(hash: string, field: string): Promise<string | null> {
    const hashKey = `${hash}:${field}`;
    return this.storage[hashKey] || null;
  }

  async hgetall(hash: string): Promise<{ [field: string]: string }> {
    const result: { [field: string]: string } = {};
    const prefix = `${hash}:`;
    
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(prefix)) {
        const field = key.substring(prefix.length);
        result[field] = this.storage[key];
      }
    });
    
    return result;
  }

  async lpush(list: string, ...values: string[]): Promise<void> {
    const existing = this.storage[list] ? JSON.parse(this.storage[list]) : [];
    this.storage[list] = JSON.stringify([...values, ...existing]);
  }

  async rpush(list: string, ...values: string[]): Promise<void> {
    const existing = this.storage[list] ? JSON.parse(this.storage[list]) : [];
    this.storage[list] = JSON.stringify([...existing, ...values]);
  }

  async lrange(list: string, start: number, stop: number): Promise<string[]> {
    const existing = this.storage[list] ? JSON.parse(this.storage[list]) : [];
    return existing.slice(start, stop === -1 ? undefined : stop + 1);
  }

  async publish(channel: string, message: string): Promise<void> {
    // Local implementation - would be real-time with actual Redis
    console.log(`Publishing to ${channel}:`, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    // Local implementation - would be real-time with actual Redis
    console.log(`Subscribed to ${channel}`);
  }
}

// Multiplayer game management
export class MultiplayerManager {
  private redis: LocalRedisClient;

  constructor() {
    this.redis = new LocalRedisClient();
  }

  // Create a duel room
  async createDuelRoom(playerId: string, universeId: string): Promise<string> {
    const roomId = `duel_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    await this.redis.hset(`room:${roomId}`, 'type', 'duel');
    await this.redis.hset(`room:${roomId}`, 'universe', universeId);
    await this.redis.hset(`room:${roomId}`, 'creator', playerId);
    await this.redis.hset(`room:${roomId}`, 'status', 'waiting');
    await this.redis.hset(`room:${roomId}`, 'created', Date.now().toString());
    
    // Add to waiting rooms list
    await this.redis.rpush('waiting_duels', roomId);
    
    return roomId;
  }

  // Join a duel room
  async joinDuelRoom(roomId: string, playerId: string): Promise<boolean> {
    const roomData = await this.redis.hgetall(`room:${roomId}`);
    
    if (!roomData || roomData.status !== 'waiting') {
      return false;
    }

    await this.redis.hset(`room:${roomId}`, 'opponent', playerId);
    await this.redis.hset(`room:${roomId}`, 'status', 'ready');
    
    return true;
  }

  // Get available duel rooms
  async getAvailableDuels(universeId: string): Promise<Array<{ roomId: string; creator: string; universe: string }>> {
    const waitingRooms = await this.redis.lrange('waiting_duels', 0, -1);
    const availableRooms = [];

    for (const roomId of waitingRooms) {
      const roomData = await this.redis.hgetall(`room:${roomId}`);
      if (roomData && roomData.status === 'waiting' && roomData.universe === universeId) {
        availableRooms.push({
          roomId,
          creator: roomData.creator,
          universe: roomData.universe
        });
      }
    }

    return availableRooms;
  }

  // Start a duel game
  async startDuel(roomId: string): Promise<void> {
    await this.redis.hset(`room:${roomId}`, 'status', 'playing');
    await this.redis.hset(`room:${roomId}`, 'started', Date.now().toString());
  }

  // Submit an answer in a duel
  async submitDuelAnswer(roomId: string, playerId: string, questionIndex: number, answer: number | null, timeLeft: number): Promise<void> {
    const answerKey = `${roomId}:${playerId}:${questionIndex}`;
    await this.redis.hset(answerKey, 'answer', answer?.toString() || 'null');
    await this.redis.hset(answerKey, 'timeLeft', timeLeft.toString());
    await this.redis.hset(answerKey, 'timestamp', Date.now().toString());
  }

  // Get duel results for a question
  async getDuelQuestionResults(roomId: string, questionIndex: number): Promise<{ player1: any; player2: any }> {
    const roomData = await this.redis.hgetall(`room:${roomId}`);
    const player1Id = roomData.creator;
    const player2Id = roomData.opponent;

    const player1Answer = await this.redis.hgetall(`${roomId}:${player1Id}:${questionIndex}`);
    const player2Answer = await this.redis.hgetall(`${roomId}:${player2Id}:${questionIndex}`);

    return {
      player1: player1Answer ? {
        answer: player1Answer.answer === 'null' ? null : parseInt(player1Answer.answer),
        timeLeft: parseInt(player1Answer.timeLeft || '0'),
        timestamp: parseInt(player1Answer.timestamp || '0')
      } : null,
      player2: player2Answer ? {
        answer: player2Answer.answer === 'null' ? null : parseInt(player2Answer.answer),
        timeLeft: parseInt(player2Answer.timeLeft || '0'),
        timestamp: parseInt(player2Answer.timestamp || '0')
      } : null
    };
  }

  // League management
  async joinLeague(playerId: string, universeId: string): Promise<void> {
    await this.redis.rpush(`league:${universeId}:players`, playerId);
    await this.redis.hset(`league:${universeId}:player:${playerId}`, 'points', '0');
    await this.redis.hset(`league:${universeId}:player:${playerId}`, 'matches', '0');
    await this.redis.hset(`league:${universeId}:player:${playerId}`, 'wins', '0');
  }

  // Get league leaderboard
  async getLeagueLeaderboard(universeId: string): Promise<Array<{ playerId: string; points: number; matches: number; wins: number }>> {
    const players = await this.redis.lrange(`league:${universeId}:players`, 0, -1);
    const leaderboard = [];

    for (const playerId of players) {
      const playerData = await this.redis.hgetall(`league:${universeId}:player:${playerId}`);
      if (playerData) {
        leaderboard.push({
          playerId,
          points: parseInt(playerData.points || '0'),
          matches: parseInt(playerData.matches || '0'),
          wins: parseInt(playerData.wins || '0')
        });
      }
    }

    return leaderboard.sort((a, b) => b.points - a.points);
  }
}

export const multiplayerManager = new MultiplayerManager();