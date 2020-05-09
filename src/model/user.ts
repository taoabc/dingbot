import PouchDB from 'pouchdb';
import config from '../config';
import logger from '../services/logger';

export interface User {
  uid: string;
  password: string;
  nick: string;
  // group: string;
}

type UserDoc = PouchDB.Core.AllDocsResponse<User>;

const DATABASE_PATH = 'db/user';
let db: PouchDB.Database<User>;

async function add(
  uid: string,
  password: string,
  nick: string
): Promise<PouchDB.Core.Response> {
  return db.put({ _id: uid, uid, nick, password });
}

async function initDB(): Promise<void | Array<PouchDB.Core.Response>> {
  db = new PouchDB(DATABASE_PATH);
  const info = await db.info();
  // init admin when no user
  if (info.doc_count === 0) {
    const promises = [];
    for (const admin of config.admin) {
      promises.push(add(admin.username, admin.password, ''));
    }
    return Promise.all(promises);
  }
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
