import { TestBed } from '@angular/core/testing';
import { BOOT_PATH, PROJECT_FILES, ProjectExplorer } from './project-explorer';

describe('ProjectExplorer', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ProjectExplorer);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const open = async (path: string) => {
      element.querySelector<HTMLButtonElement>(`[data-file="${path}"]`)!.click();
      await fixture.whenStable();
    };
    return { fixture, element, open };
  };

  it('lists every file of the project tree as a button', async () => {
    const { element } = await render();
    expect(element.querySelectorAll('[data-file]').length).toBe(PROJECT_FILES.length);
  });

  it('opening a file shows its explanation and its real code', async () => {
    const { element, open } = await render();
    await open('src/app/app.html');
    expect(element.querySelector('[data-detail]')!.textContent).toContain('template');
    expect(element.querySelector('[data-detail] vm-code')).toBeTruthy();
    expect(element.querySelector('[data-file="src/app/app.html"]')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('files without code to show (like node_modules) only explain', async () => {
    const { element, open } = await render();
    await open('node_modules/');
    expect(element.querySelector('[data-detail] vm-code')).toBeNull();
    expect(element.querySelector('[data-detail]')!.textContent).toContain('npm install');
  });

  it('the boot button walks index.html → main.ts → app.ts → app.html, announcing each step', async () => {
    const { fixture, element } = await render();
    expect(BOOT_PATH).toEqual(['src/index.html', 'src/main.ts', 'src/app/app.ts', 'src/app/app.html']);
    const boot = element.querySelector<HTMLButtonElement>('[data-boot]')!;
    for (const path of BOOT_PATH) {
      boot.click();
      await fixture.whenStable();
      expect(element.querySelector('[data-file][aria-pressed="true"]')!.getAttribute('data-file')).toBe(path);
    }
    expect(element.querySelector('[data-announce]')!.textContent).toContain('app.html');
  });
});
