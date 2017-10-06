/* eslint-env mocha */
const expect = require('chai').expect
function add (x, y) {
  return x + y
}

describe('test', () => {
  it('1 + 1 = 2', () => {
    expect(add(1, 1)).equal(2)
  })
})
