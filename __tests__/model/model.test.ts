import { employee, signKey } from '../../src/model';
import initDB from '../../src/model';

const data: model.Employee[] = [
  {
    realName: 'jim',
    authorEmail: 'jimauthor@a.com',
    authorName: 'jimauthor',
    userEmail: 'jimUser@a.com',
    userName: 'jimuser',
    phone: '13333333330',
  },
  {
    realName: 'tom',
    authorEmail: 'tomauthor@a.com',
    authorName: 'tomauthor',
    userEmail: 'tomUser@a.com',
    userName: 'tomuser',
    phone: '13333333331',
  },
  {
    realName: 'lucy',
    authorEmail: 'lucyauthor@a.com',
    authorName: 'lucyauthor',
    userEmail: 'lucyUser@a.com',
    userName: 'lucyuser',
    phone: '13333333332',
  },
  {
    realName: 'lily',
    authorEmail: 'lilyauthor@a.com',
    authorName: 'lilyauthor',
    userEmail: 'lilyUser@a.com',
    userName: 'lilyuser',
    phone: '13333333333',
  },
  {
    realName: 'lilei',
    authorEmail: 'lileiauthor@a.com',
    authorName: 'lileiauthor',
    userEmail: 'lileiUser@a.com',
    userName: 'lileiuser',
    phone: '13333333334',
  },
  {
    realName: 'ht',
    authorEmail: 'htauthor@a.com',
    authorName: 'htauthor',
    userEmail: 'htUser@a.com',
    userName: 'htuser',
    phone: '13333333335',
  },
];

test('initDB', () => {
  expect(initDB()).toBeFalsy();
});

test('add to db', () => {
  return expect(employee.add(data)).resolves.toBeTruthy();
});

test('get All', () => {
  return expect(employee.getAll()).resolves.toHaveLength(6);
});

test('find by email', () => {
  return expect(
    employee.find('htuser', 'lilyauthor@a.com')
  ).resolves.toMatchObject(data[3]);
});

test('find by userName', () => {
  return expect(employee.find('lileiuser', 'aaa@a.com')).resolves.toMatchObject(
    data[4]
  );
});

test('get phone', () => {
  return expect(employee.getPhone('lilyauthor')).resolves.toBe(data[3].phone);
});

test('get realName', () => {
  return expect(employee.getRealName('haha', 'htUser@a.com')).resolves.toBe(
    data[5].realName
  );
});

test('find nothing', () => {
  return expect(employee.find('haha', 'heihei@a.com')).resolves.toBeNull();
});

test('add sign key', () => {
  return Promise.all([
    expect(signKey.add('token1', 'signkey1')).resolves.toBeTruthy(),
    expect(signKey.add('token2', 'signkey2')).resolves.toBeTruthy(),
  ]);
});

test('find sign key', () => {
  return expect(signKey.find('token2')).resolves.toBe('signkey2');
});

test('update and find', async () => {
  await expect(signKey.update('token2', 'signkey22')).resolves.toBeTruthy();
  return expect(signKey.find('token2')).resolves.toBe('signkey22');
});

test('remove and find', async () => {
  await expect(signKey.remove('token2')).resolves.toBeTruthy();
  return expect(signKey.find('token2')).resolves.toBe('');
});

test('destroy model', async () => {
  return Promise.all([
    expect(employee.destroyDB()).resolves.toBeTruthy(),
    expect(signKey.destroyDB()).resolves.toBeTruthy(),
  ]);
});
