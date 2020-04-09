import PouchDB from 'pouchdb';
import logger from '../services/logger';

export interface SignKey {
  token: string;
  signKey: string;
}

type SignKeyDoc = PouchDB.Core.AllDocsResponse<SignKey>;

const DATABASE_PATH = 'db/signkey';
let db: PouchDB.Database<SignKey>;

function initSignKeyDB(): void {
  db = new PouchDB(DATABASE_PATH);
}

async function findSignKey(token: string): Promise<string> {
  try {
    const result = await db.get(token);
    return result.signKey;
  } catch {
    return '';
  }
}
function destroySignKeyDB(): Promise<void> {
  return db.destroy();
}

async function addSignKey(
  token: string,
  signKey: string
): Promise<PouchDB.Core.Response> {
  return db.put({ _id: token, token, signKey });
}

async function updateSignKey(
  token: string,
  signKey: string
): Promise<PouchDB.Core.Response | void> {
  try {
    const doc = await db.get(token);
    doc.signKey = signKey;
    return db.put(doc);
  } catch (err) {
    logger.error(err);
  }
}

async function removeSignKey(token: string): Promise<boolean> {
  try {
    const doc = await db.get(token);
    const response = await db.remove(doc);
    return response.ok;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

async function getAllSignKey(): Promise<SignKey[]> {
  const result: SignKey[] = [];
  const docs: SignKeyDoc = await db.allDocs({
    // eslint-disable-next-line @typescript-eslint/camelcase
    include_docs: true,
    // startkey: '_design/',
  });
  for (const row of docs.rows) {
    const doc = row.doc;
    if (doc?.token) {
      result.push(doc);
    }
  }
  return result;
}

export {
  getAllSignKey,
  addSignKey,
  updateSignKey,
  findSignKey,
  removeSignKey,
  destroySignKeyDB,
};

export default initSignKeyDB;
