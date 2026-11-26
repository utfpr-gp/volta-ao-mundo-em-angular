import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { AppUpdates } from './app-updates';

describe('AppUpdates', () => {
  /** Um SwUpdate falso: o teste diz se o service worker está ligado e anuncia os eventos. */
  const setup = (isEnabled: boolean) => {
    const versionUpdates = new Subject<VersionEvent>();
    TestBed.configureTestingModule({ providers: [{ provide: SwUpdate, useValue: { isEnabled, versionUpdates } }] });
    return { updates: TestBed.inject(AppUpdates), versionUpdates };
  };

  it('says a new version is ready only when the service worker has it downloaded', () => {
    const { updates, versionUpdates } = setup(true);
    versionUpdates.next({ type: 'VERSION_DETECTED', version: { hash: 'b' } });
    expect(updates.ready()).toBe(false);
    versionUpdates.next({ type: 'VERSION_READY', currentVersion: { hash: 'a' }, latestVersion: { hash: 'b' } });
    expect(updates.ready()).toBe(true);
  });

  it('stays quiet when there is no service worker (ng serve and tests)', () => {
    const { updates, versionUpdates } = setup(false);
    versionUpdates.next({ type: 'VERSION_READY', currentVersion: { hash: 'a' }, latestVersion: { hash: 'b' } });
    expect(updates.ready()).toBe(false);
  });
});
