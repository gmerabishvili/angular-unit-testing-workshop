import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User, UsersService } from '../users.service';
import { map, Observable, startWith } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-user-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent implements OnInit {
  form!: FormGroup;

  roleOptions: string[] = [];
  filteredRoles!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [this.data?.name || ''],
      email: [this.data?.email || ''],
      role: [this.data?.role || ''],
    });
  }

  private loadRoles(): void {
    this.usersService.getRoles().subscribe((roles: string[]): void => {
      this.roleOptions = roles;

      this.filteredRoles = this.form.get('role')!.valueChanges.pipe(
        startWith(this.data?.role || ''),
        map(value => this._filterRoles(value || ''))
      );
    });
  }

  private _filterRoles(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.roleOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private onClose(): void {
    this.dialogRef.close(this.form.value);
  }

  submit(): void {
    if (this.form.valid) {
      this.onClose();
    }
  }
}
