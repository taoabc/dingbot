import path from 'path';

export function rootPath(): string {
  return path.resolve(__dirname, 'dist');
}

export function staticRrefix(): string {
  return '--web-static--';
}
