// tests/circus.test.js
describe('circus test', () => {
  it('works', () => {
    expect(1).toBe(1);
  });

  it('aaa', () => {
    expect(1).toBe(1);
  });
});

describe('second circus test', () => {
  it('bbb', () => {
    expect(1).toBe(1);
  });
  it(`doesn't work`, () => {
    expect(1).toBe(2);
  });
});
