import PouchDB from 'pouchdb';
import logger from '../services/logger';

export interface Account {
  uid: string;
  password: string;
  nick: string;
}

type AccountDoc = PouchDB.Core.AllDocsResponse<Account>;

const DATABASE_PATH = 'db/user';
let db: PouchDB.Database<Account>;

function initDB(): void {
  db = new PouchDB(DATABASE_PATH);
}

function destroyDB(): Promise<void> {
  return db.destroy();
}

async function login(uid: string, password: string): Promise<unknown> {
  try {
    const doc = await db.get(uid);
    if (doc.password === password) {
      return {
        uid,
        nick: doc.nick,
      };
    }
  } catch {
    return null;
  }
  return null;
}

async function add(
  uid: string,
  password: string,
  nick: string
): Promise<PouchDB.Core.Response> {
  return db.put({ _id: uid, uid, nick, password });
}

async function remove(uid: string): Promise<boolean> {
  try {
    const doc = await db.get(uid);
    const response = await db.remove(doc);
    return response.ok;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

export { login, add, remove, destroyDB };

export default initDB;
