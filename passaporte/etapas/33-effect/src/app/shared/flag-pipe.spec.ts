import { FlagPipe } from './flag-pipe';

describe('FlagPipe', () => {
  const pipe = new FlagPipe();

  it('turns a country code into its flag', () => {
    expect(pipe.transform('BR')).toBe('🇧🇷');
    expect(pipe.transform('jp')).toBe('🇯🇵');
  });

  it('shows a white flag for an invalid code', () => {
    expect(pipe.transform('Brasil')).toBe('🏳️');
  });
});
