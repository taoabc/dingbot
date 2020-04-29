import { rootPath } from '../../packages/ui/exp';
import path from 'path';

test('test path', () => {
  const uiPathCalc = path.resolve(__dirname + '../../../packages/ui/dist');
  expect(rootPath()).toEqual(uiPathCalc);
});
