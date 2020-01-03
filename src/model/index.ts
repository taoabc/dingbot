import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { EmployeeField, Employee } from './employee';

let db: PouchDB.Database;

async function initDB(): Promise<void> {
  PouchDB.plugin(PouchDBFind);
  db = new PouchDB('employee');
  db.createIndex({
    index: { fields: ['authorName', 'authorEmail', 'userName', 'userEmail'] }
  });
}

function notFind(result: PouchDB.Find.FindResponse<{}> | null): boolean {
  return result != null && result.docs.length === 0;
}

async function find(name: string, email?: string): Promise<Employee | null> {
  let result: PouchDB.Find.FindResponse<{}> | null = null;
  if (email) {
    result = await db.find({
      selector: { [EmployeeField.AUTHOR_EMAIL]: email }
    });
    if (notFind(result)) {
      result = await db.find({
        selector: { [EmployeeField.USER_EMAIL]: email }
      });
    }
  }
  if (notFind(result)) {
    result = await db.find({ selector: { [EmployeeField.USER_NAME]: name } });
  }
  if (notFind(result)) {
    result = await db.find({ selector: { [EmployeeField.AUTHOR_NAME]: name } });
  }
  if (notFind(result)) {
    return null;
  } else {
    return (result!.docs[0] as any) as Employee;
  }
}

async function getRealName(name: string, email?: string): Promise<string> {
  const employee = await find(name, email);
  return employee ? employee[EmployeeField.REAL_NAME] : name;
}

async function getPhone(name: string, email?: string): Promise<string | null> {
  const employee = await find(name, email);
  return employee ? employee[EmployeeField.PHONE] : null;
}

export { initDB, find, getRealName, getPhone };
