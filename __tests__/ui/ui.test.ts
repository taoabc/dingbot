import uiPath from '../../packages/ui/path';
import path from 'path';

test('test path', () => {
  const uiPathCalc = path.resolve(__dirname + '../../../packages/ui/dist');
  expect(uiPath()).toEqual(uiPathCalc);
});
