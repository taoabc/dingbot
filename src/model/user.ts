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

async function check(uid: string, password: string): Promise<boolean> {
  try {
    const doc = await db.get(uid);
    return doc.password === password;
  } catch {
    return false;
  }
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

export { check, add, remove, destroyDB };

export default initDB;
