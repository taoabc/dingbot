import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import initSignKeyDB from './sign-key';
import initEmployeeDB from './employee';
import initUserDB from './user';

export * as employee from './employee';
export * as signKey from './sign-key';
export * as user from './user';

function initDB(): void {
  PouchDB.plugin(PouchDBFind);
  initEmployeeDB();
  initUserDB();
  initSignKeyDB();
}

export default initDB;
