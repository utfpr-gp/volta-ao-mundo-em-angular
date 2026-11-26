import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { ErrorReport } from './error-report';

describe('AppErrorHandler', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }] }));
  afterEach(() => vi.restoreAllMocks());

  it('keeps the full error in the console, as the default ErrorHandler does', () => {
    const console = vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});
    const error = new Error('quebrou');
    TestBed.inject(ErrorHandler).handleError(error);
    expect(console).toHaveBeenCalledWith('ERROR', error);
  });

  it('shows the warning to whoever uses the app', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const report = TestBed.inject(ErrorReport);
    expect(report.visible()).toBe(false);
    TestBed.inject(ErrorHandler).handleError(new Error('quebrou'));
    expect(report.visible()).toBe(true);
    report.dismiss();
    expect(report.visible()).toBe(false);
  });
});
