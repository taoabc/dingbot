export enum EmployeeField {
  AUTHOR_NAME = 'authorEmail',
  REAL_NAME = 'realName',
  AUTHOR_EMAIL = 'authorEmail',
  USER_NAME = 'userName',
  USER_EMAIL = 'userEmail',
  PHONE = 'phone'
}

export interface Employee {
  [EmployeeField.REAL_NAME]: string;
  [EmployeeField.AUTHOR_NAME]: string;
  [EmployeeField.AUTHOR_EMAIL]: string;
  [EmployeeField.USER_NAME]: string;
  [EmployeeField.USER_EMAIL]: string;
  [EmployeeField.PHONE]: string;
}
