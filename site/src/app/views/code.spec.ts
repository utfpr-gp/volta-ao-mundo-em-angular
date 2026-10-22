import { TestBed } from '@angular/core/testing';
import { Code, SNIPPET_SOURCE } from './code';

const FAKE = {
  '01/counter': {
    lang: 'angular-ts',
    html: '<pre class="shiki" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span> total = 0;</span></code></pre>',
    source: 'const total = 0;\n',
  },
};

describe('Code', () => {
  const render = async (caption?: string) => {
    TestBed.configureTestingModule({ providers: [{ provide: SNIPPET_SOURCE, useValue: FAKE }] });
    const fixture = TestBed.createComponent(Code);
    fixture.componentRef.setInput('snippet', '01/counter' as never);
    if (caption) fixture.componentRef.setInput('caption', caption);
    await fixture.whenStable();
    return fixture;
  };

  afterEach(() => vi.unstubAllGlobals());

  it('renders the pre-highlighted html without the sanitizer stripping style attributes', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    const pre = element.querySelector('pre.shiki')!;
    expect(pre.getAttribute('style')).toContain('--shiki-light');
    expect(pre.querySelector('span[style*="--shiki-dark"]')?.textContent).toBe('const');
  });

  it('shows the file name and the language label', async () => {
    const text = ((await render('contador.ts')).nativeElement as HTMLElement).textContent!;
    expect(text).toContain('contador.ts');
    expect(text).toContain('TypeScript');
  });

  it('copy button writes the plain source to the clipboard and announces "Código copiado"', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('button')!.click();
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(element.querySelector('[aria-live="polite"]')?.textContent).toContain('Código copiado');
    });
    expect(writeText).toHaveBeenCalledWith('const total = 0;\n');
  });

  it('says when copying is not possible', async () => {
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: vi.fn().mockRejectedValue(new Error('negado')) } });
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('button')!.click();
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(element.querySelector('[aria-live="polite"]')?.textContent).toContain('Não foi possível copiar');
    });
  });
});
