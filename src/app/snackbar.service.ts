import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) { }

  show(message: string, actionText = 'Ok', config: MatSnackBarConfig = {duration: 5000}): void {
    this.snackBar.open(message, actionText, config);
  }
}

