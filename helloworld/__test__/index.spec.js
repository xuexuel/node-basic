test('测试Hello world', () => {
  const rets = require('../index')
  // console.log('helloworld', helloworld);
  expect(rets).toBe('Hello world1')
})