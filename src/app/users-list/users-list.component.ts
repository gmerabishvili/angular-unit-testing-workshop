import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {UserFormDialogComponent} from './user-form-dialog/user-form-dialog.component';
import {User, UsersService} from './users.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {SnackbarService} from '../snackbar.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource: User[] = [];
  isLoading = false;

  constructor(private usersService: UsersService,
              private dialog: MatDialog,
              private snackBarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (users: User[]): void => {
        this.dataSource = users;
        this.isLoading = false;
      },
      error: () => {
        this.snackBarService.show('Failed to fetch users');
        this.isLoading = false;
      }
    });
  }

  add(): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '600px'
    }).afterClosed().subscribe((result: User) => {
      if (result) {
        this.usersService.addUser(result).subscribe({
          next: (newUser: User) => {
            this.dataSource.push(newUser);
            this.dataSource = [...this.dataSource];
            this.snackBarService.show('User created!');
          },
          error: () => {
            this.snackBarService.show('Failed to add user');
          }
        });
      }
    });
  }

  edit(user: User): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '600px',
      data: {...user}
    }).afterClosed().subscribe((result: User) => {
      if (result) {
        const index = this.dataSource.indexOf(user);
        if (index > -1) {
          this.usersService.updateUser(index, result).subscribe({
            next: (updatedUser: User) => {
              this.dataSource[index] = updatedUser;
              this.dataSource = [...this.dataSource];
            },
            error: () => {
              this.snackBarService.show('Failed to update user');
            }
          });
        }
      }
    });
  }
}
