import { TestBed } from '@angular/core/testing';
import { TerminalTrainer, initialTerminal, runCommand } from './terminal-trainer';

describe('runCommand (modelo do terminal)', () => {
  it('pwd shows the current folder', () => {
    expect(runCommand(initialTerminal(), 'pwd').output).toEqual(['/home/voce']);
  });

  it('ls lists the folders of the current folder', () => {
    expect(runCommand(initialTerminal(), 'ls').output).toEqual(['Documentos  Downloads']);
  });

  it('mkdir creates a folder and cd enters it', () => {
    let state = runCommand(initialTerminal(), 'mkdir projetos').state;
    state = runCommand(state, 'cd projetos').state;
    expect(runCommand(state, 'pwd').output).toEqual(['/home/voce/projetos']);
  });

  it('cd .. goes up one folder, and never above the home folder', () => {
    let state = runCommand(initialTerminal(), 'cd Documentos').state;
    state = runCommand(state, 'cd ..').state;
    expect(state.cwd).toEqual([]);
    expect(runCommand(state, 'cd ..').state.cwd).toEqual([]);
  });

  it('cd into a folder that does not exist shows the real bash message', () => {
    expect(runCommand(initialTerminal(), 'cd Fotos').output).toEqual(['bash: cd: Fotos: Arquivo ou diretório inexistente']);
  });

  it('node -v and npm -v show versions', () => {
    expect(runCommand(initialTerminal(), 'node -v').output).toEqual(['v24.20.0']);
    expect(runCommand(initialTerminal(), 'npm -v').output).toEqual(['11.19.0']);
  });

  it('an unknown command shows the real bash message', () => {
    expect(runCommand(initialTerminal(), 'nodee -v').output).toEqual(['bash: nodee: comando não encontrado']);
  });

  it('mkdir without a name shows the real coreutils message', () => {
    expect(runCommand(initialTerminal(), 'mkdir').output[0]).toBe('mkdir: falta operando');
  });

  it('clear empties the screen and an empty line does nothing', () => {
    expect(runCommand(initialTerminal(), 'clear').clear).toBe(true);
    expect(runCommand(initialTerminal(), '   ').output).toEqual([]);
  });

  it('marks the missions the person completed', () => {
    let state = initialTerminal();
    for (const command of ['pwd', 'ls', 'mkdir angular', 'cd angular', 'node -v']) state = runCommand(state, command).state;
    expect(state.done).toEqual(['pwd', 'ls', 'mkdir', 'cd', 'node']);
  });
});

describe('TerminalTrainer', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(TerminalTrainer);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const type = async (command: string) => {
      const input = element.querySelector<HTMLInputElement>('input')!;
      input.value = command;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await fixture.whenStable();
    };
    return { fixture, element, type };
  };

  it('has a labelled text field and shows the command with its output', async () => {
    const { element, type } = await render();
    expect(element.querySelector('label')?.textContent).toContain('Digite um comando');
    await type('pwd');
    const screen = element.querySelector('[data-screen]')!.textContent!;
    expect(screen).toContain('$ pwd');
    expect(screen).toContain('/home/voce');
  });

  it('announces the output in an aria-live region', async () => {
    const { element, type } = await render();
    await type('node -v');
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('v24.20.0');
  });

  it('checks off a mission when it is done', async () => {
    const { element, type } = await render();
    await type('pwd');
    expect(element.querySelector('[data-mission="pwd"]')!.getAttribute('data-done')).toBe('true');
  });

  it('arrow up brings back the previous command', async () => {
    const { fixture, element, type } = await render();
    await type('ls');
    const input = element.querySelector<HTMLInputElement>('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await fixture.whenStable();
    expect(input.value).toBe('ls');
  });
});
