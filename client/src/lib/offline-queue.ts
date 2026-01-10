import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineRequest {
  id?: number;
  url: string;
  method: string;
  body: any;
  timestamp: number;
  type: 'attendance' | 'approval' | 'general'; // 요청 유형 분류
}

interface AttendanceDB extends DBSchema {
  'offline-requests': {
    key: number;
    value: OfflineRequest;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'attendance-offline-db';
const STORE_NAME = 'offline-requests';

class OfflineQueue {
  private dbPromise: Promise<IDBPDatabase<AttendanceDB>>;

  constructor() {
    this.dbPromise = openDB<AttendanceDB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-timestamp', 'timestamp');
      },
    });
  }

  async addRequest(url: string, method: string, body: any, type: OfflineRequest['type'] = 'general') {
    const db = await this.dbPromise;
    await db.add(STORE_NAME, {
      url,
      method,
      body,
      timestamp: Date.now(),
      type,
    });
    console.log(`[OfflineQueue] Request queued: ${method} ${url}`);
  }

  async getAllRequests(): Promise<OfflineRequest[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex(STORE_NAME, 'by-timestamp');
  }

  async removeRequest(id: number) {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, id);
  }

  async clearQueue() {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }
  
  async getCount(): Promise<number> {
    const db = await this.dbPromise;
    return db.count(STORE_NAME);
  }
}

export const offlineQueue = new OfflineQueue();
