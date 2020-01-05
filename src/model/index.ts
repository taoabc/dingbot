import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { EmployeeField, Employee } from './employee';

type EmployeeDoc = PouchDB.Core.AllDocsResponse<Employee>;

const DATABASE_PATH = 'db/employee';
let db: PouchDB.Database<Employee>;

async function initDB(): Promise<void> {
  PouchDB.plugin(PouchDBFind);
  db = new PouchDB(DATABASE_PATH);
  db.createIndex({
    index: { fields: ['authorName', 'authorEmail', 'userName', 'userEmail'] }
  });
}

function notFind(result: PouchDB.Find.FindResponse<{}> | null): boolean {
  return result != null && result.docs.length === 0;
}

async function find(name: string, email?: string): Promise<Employee | null> {
  let result: PouchDB.Find.FindResponse<Employee> | null = null;
  if (email) {
    result = await db.get(email);
    if (notFind(result)) {
      result = await db.find({
        selector: { [EmployeeField.AUTHOR_EMAIL]: email }
      });
    }
  }
  if (notFind(result)) {
    result = await db.find({ selector: { [EmployeeField.USER_NAME]: name } });
  }
  if (notFind(result)) {
    result = await db.find({ selector: { [EmployeeField.AUTHOR_NAME]: name } });
  }
  if (!notFind(result)) {
    if (result) return result.docs[0];
  }
  return null;
}

async function getRealName(name: string, email?: string): Promise<string> {
  const employee = await find(name, email);
  return employee ? employee.realName : name;
}

async function getPhone(name: string, email?: string): Promise<string | null> {
  const employee = await find(name, email);
  return employee ? employee[EmployeeField.PHONE] : null;
}

async function add(employee: Employee): Promise<PouchDB.Core.Response>;
async function add(
  employee: Employee[]
): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>>;
async function add(
  employee: Employee | Employee[]
): Promise<
  PouchDB.Core.Response | Array<PouchDB.Core.Response | PouchDB.Core.Error>
> {
  if (Array.isArray(employee)) {
    const bulk: PouchDB.Core.PutDocument<Employee>[] = [];
    for (const emp of employee) {
      bulk.push({ _id: emp.userName, ...employee });
    }
    return db.bulkDocs(bulk);
  } else {
    return db.put({ _id: employee.userName, ...employee });
  }
}

async function getAll(): Promise<Employee[]> {
  const emps: Employee[] = [];
  // eslint-disable-next-line @typescript-eslint/camelcase
  const docs: EmployeeDoc = await db.allDocs({ include_docs: true });
  for (const row of docs.rows) {
    const emp = row.doc;
    if (emp) {
      emps.push(emp);
    }
  }
  return emps;
}

export { initDB, add, find, getRealName, getPhone, getAll };
