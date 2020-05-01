import PouchDB from 'pouchdb';

export enum EmployeeField {
  REAL_NAME = 'realName', // display name
  AUTHOR_NAME = 'authorName', // git username, git config user.name
  AUTHOR_EMAIL = 'authorEmail', // git email, git config user.email
  USER_NAME = 'userName', // gitlab username, email prefix
  USER_EMAIL = 'userEmail', // gitlab email
  PHONE = 'phone', // mobile phone number
}

export interface Employee {
  [EmployeeField.REAL_NAME]: string;
  [EmployeeField.AUTHOR_NAME]: string;
  [EmployeeField.AUTHOR_EMAIL]: string;
  [EmployeeField.USER_NAME]: string;
  [EmployeeField.USER_EMAIL]: string;
  [EmployeeField.PHONE]: string;
}

type EmployeeDoc = PouchDB.Core.AllDocsResponse<Employee>;

const DATABASE_PATH = 'db/employee';
let db: PouchDB.Database<Employee>;

function initDB(): void {
  db = new PouchDB(DATABASE_PATH);
  db.createIndex({
    index: {
      fields: [
        EmployeeField.AUTHOR_NAME,
        EmployeeField.AUTHOR_EMAIL,
        EmployeeField.USER_EMAIL,
      ],
    },
  });
}

function destroyDB(): Promise<void> {
  return db.destroy();
}

function notFind(result: PouchDB.Find.FindResponse<{}> | null): boolean {
  return result == null || result.docs.length === 0;
}

async function find(name: string, email?: string): Promise<Employee | null> {
  let result: PouchDB.Find.FindResponse<Employee> | null = null;
  if (email) {
    result = await db.find({ selector: { [EmployeeField.USER_EMAIL]: email } });
    if (notFind(result)) {
      result = await db.find({
        selector: { [EmployeeField.AUTHOR_EMAIL]: email },
      });
    }
  }
  if (notFind(result)) {
    try {
      const getResult = await db.get(name);
      return getResult;
    } catch {
      result = await db.find({
        selector: { [EmployeeField.AUTHOR_NAME]: name },
      });
    }
  }
  if (!notFind(result)) {
    return result ? result.docs[0] : null;
  }
  return null;
}

async function getRealName(name: string, email?: string): Promise<string> {
  const employee = await find(name, email);
  return employee ? employee.realName : name;
}

async function getPhone(name: string, email?: string): Promise<string | null> {
  const employee = await find(name, email);
  return employee ? employee.phone : null;
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
      bulk.push({ _id: emp.userName, ...emp });
    }
    return db.bulkDocs(bulk);
  } else {
    return db.put({ _id: employee.userName, ...employee });
  }
}

async function getAll(): Promise<Employee[]> {
  const emps: Employee[] = [];
  const docs: EmployeeDoc = await db.allDocs({
    // eslint-disable-next-line @typescript-eslint/camelcase
    include_docs: true,
    // startkey: '_design/',
  });
  for (const row of docs.rows) {
    if (row.doc?.userName) {
      // TODO hide _id and _rev
      emps.push(row.doc);
    }
  }
  return emps;
}

async function update(
  employee: Employee
): Promise<PouchDB.Core.Response | void> {}

async function remove(): Promise<PouchDB.Core.Response | void> {}

export { add, update, remove, find, getRealName, getPhone, getAll, destroyDB };

export default initDB;
