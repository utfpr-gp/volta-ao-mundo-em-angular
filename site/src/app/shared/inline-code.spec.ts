import { inlineCode, plainText } from './inline-code';

describe('inlineCode', () => {
  it('splits on backticks', () => {
    expect(inlineCode('com `signal()` e')).toEqual([
      { code: false, text: 'com ' },
      { code: true, text: 'signal()' },
      { code: false, text: ' e' },
    ]);
  });

  it('keeps text without backticks as one part', () => {
    expect(inlineCode('Como navegar?')).toEqual([{ code: false, text: 'Como navegar?' }]);
  });

  it('handles code at the start and the end', () => {
    expect(inlineCode('`@if` e `@switch`')).toEqual([
      { code: true, text: '@if' },
      { code: false, text: ' e ' },
      { code: true, text: '@switch' },
    ]);
  });

  it('treats an unmatched backtick as plain text', () => {
    expect(inlineCode('um ` solto')).toEqual([{ code: false, text: 'um ` solto' }]);
  });
});

describe('plainText', () => {
  it('removes the backticks', () => {
    expect(plainText('Como guardar estado com `signal()` e `computed()`?')).toBe(
      'Como guardar estado com signal() e computed()?',
    );
  });
});
