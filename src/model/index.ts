import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import initSignKeyDB from './sign-key';
import initUserDB from './user';

export * from './user';
export * from './sign-key';

function initDB(): void {
  PouchDB.plugin(PouchDBFind);
  initUserDB();
  initSignKeyDB();
}

export default initDB;
