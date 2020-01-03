import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

test('create pouchdb', async () => {
  const db = new PouchDB('db/testdb');
  await db.put({
    _id: 'test1',
    a: '1',
    b: '3'
  });
  const data = await db.get('test1');
  (data as any).a = 4;
  db.put(data);

  const data2 = await db.get('test1');
  console.log(data2);
  await db.destroy();
});

test('find in db', async () => {
  const db = new PouchDB('db/testdb2');
  await db.createIndex({
    index: { fields: ['age'] }
  });
  await db.bulkDocs([
    { _id: 'test1', age: 13, name: 'a' },
    { _id: 'test2', age: 18, name: 'b' },
    { _id: 'test3', age: 13, name: 'c' }
  ]);
  const docs = await db.find({
    selector: { age: 13 },
    fields: ['_id']
  });
  const docs2 = await db.find({
    selector: { name: 'a' }
  });
  console.log(docs || docs2);
  await db.destroy();
});

test('create index', async () => {
  const db = new PouchDB('db/create-index');
  let info = await db.createIndex({
    index: { fields: ['age'] }
  });
  console.log(info);
  info = await db.createIndex({
    index: { fields: ['age'] }
  });
  console.log(info);
  await db.destroy();
});
