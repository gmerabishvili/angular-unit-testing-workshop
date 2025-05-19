import { SnackbarService } from './snackbar.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    service = new SnackbarService(snackBar);
  });

  describe('show', () => {
    it('should open snackbar with default parameters', () => {
      const message = 'Test message';
      service.show(message);

      expect(snackBar.open).toHaveBeenCalledOnceWith(
        message,
        'Ok',
        { duration: 5000 }
      );
    });

    it('should open snackbar with custom action text', () => {
      const message = 'Test message';
      const actionText = 'Close';
      service.show(message, actionText);

      expect(snackBar.open).toHaveBeenCalledOnceWith(
        message,
        actionText,
        { duration: 5000 }
      );
    });

    it('should open snackbar with custom config', () => {
      const message = 'Test message';
      const customConfig: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'center' as MatSnackBarHorizontalPosition
      };
      service.show(message, 'Ok', customConfig);

      expect(snackBar.open).toHaveBeenCalledOnceWith(
        message,
        'Ok',
        customConfig
      );
    });
  });
});
