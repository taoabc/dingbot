import path from 'path';
export default function(): string {
  return path.resolve(__dirname, 'dist');
}
