import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/**
 * Avisa quando uma versão nova do Passaporte foi publicada e já está baixada. O service worker continua servindo a versão
 * antiga, a que está guardada, até a página recarregar: é a pessoa quem decide a hora.
 */
@Service()
export class AppUpdates {
  private readonly document = inject(DOCUMENT);
  /** Há uma versão nova pronta para usar. */
  readonly ready = signal(false);

  constructor() {
    const updates = inject(SwUpdate);
    // No ng serve e nos testes, o service worker não existe: o isEnabled é false, e não há nada a escutar.
    if (!updates.isEnabled) return;
    updates.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'), // [!code highlight]
        takeUntilDestroyed(),
      )
      .subscribe(() => this.ready.set(true));
  }

  /** Recarrega a página: o service worker passa a servir a versão nova. */
  reload(): void {
    this.document.location.reload();
  }
}
