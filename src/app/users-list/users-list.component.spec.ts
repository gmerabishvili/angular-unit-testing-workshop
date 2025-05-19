import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UsersListComponent} from './users-list.component';
import {MatDialog} from '@angular/material/dialog';
import {UsersService, User} from './users.service';
import {SnackbarService} from '../snackbar.service';
import {UserFormDialogComponent} from './user-form-dialog/user-form-dialog.component';
import {of, throwError, Observable} from 'rxjs';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

class MockUsersService {
  getUsers(): Observable<User[]> {
    return of([]);
  }

  addUser(user: User): Observable<User> {
    return of(user);
  }

  updateUser(index: number, user: User): Observable<User> {
    return of(user);
  }
}

class MockSnackbarService {
  show(_message: string): void {
  }
}

class MockMatDialog {
  open(_component: any, _config?: any) {
    return {
      afterClosed: () => of(null)
    };
  }
}

// === WITH TestBed ===

describe('UsersListComponent - WITH TestBed', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let usersService: UsersService;
  let dialog: MatDialog;
  let snackBarService: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersListComponent,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: UsersService, useClass: MockUsersService},
        {provide: MatDialog, useClass: MockMatDialog},
        {provide: SnackbarService, useClass: MockSnackbarService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    dialog = TestBed.inject(MatDialog);
    snackBarService = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// === WITHOUT TestBed ===

describe('UsersListComponent - WITHOUT TestBed', () => {
  let component: UsersListComponent;
  let usersService!: jasmine.SpyObj<UsersService>;
  let dialog!: jasmine.SpyObj<MatDialog>;
  let snackBarService!: jasmine.SpyObj<SnackbarService>;

  const mockUsers = [
    {name: 'Gio Mera', email: 'gio@example.com', role: 'Admin'},
    {name: 'Jane Smith', email: 'jane@example.com', role: 'User'}
  ];

  const newUser: User = {name: 'New User', email: 'new@example.com', role: 'User'};

  beforeEach(() => {
    usersService = jasmine.createSpyObj('UsersService', ['getUsers', 'addUser', 'updateUser']);
    usersService.getUsers.and.returnValue(of(mockUsers));
    usersService.addUser.and.returnValue(of(newUser))

    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    snackBarService = jasmine.createSpyObj('SnackbarService', ['show']);

    component = new UsersListComponent(usersService, dialog, snackBarService)
  });

  describe('ngOnInit', () => {
    it('should load users on init', () => {
      component.ngOnInit();

      expect(usersService.getUsers).toHaveBeenCalledOnceWith();
      expect(component.dataSource).toEqual(mockUsers);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading users', () => {
      usersService.getUsers.and.returnValue(throwError(() => new Error('Failed to fetch')));

      component.ngOnInit();

      expect(snackBarService.show).toHaveBeenCalledOnceWith('Failed to fetch users');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Add', () => {
    it('should open dialog and add new user', () => {
      dialog.open.and.returnValue({afterClosed: () => of(newUser)} as any);
      component.add();

      expect(dialog.open).toHaveBeenCalledOnceWith(UserFormDialogComponent, {width: '600px'});
      expect(usersService.addUser).toHaveBeenCalledOnceWith(newUser);
      expect(snackBarService.show).toHaveBeenCalledOnceWith('User created!');
    });

    it('should handle error when adding user', () => {
      dialog.open.and.returnValue({afterClosed: () => of(newUser)} as any);
      usersService.addUser.and.returnValue(throwError(() => new Error('Failed to add user')));

      component.add();

      expect(snackBarService.show).toHaveBeenCalledOnceWith('Failed to add user');
      expect(component.dataSource).toEqual([]);
    });

    it('should not attempt to add user if dialog is closed without result', () => {
      dialog.open.and.returnValue({afterClosed: () => of(null)} as any);

      component.add();

      expect(usersService.addUser).not.toHaveBeenCalled();
      expect(snackBarService.show).not.toHaveBeenCalled();
    });
  });

  describe('Edit', () => {
    let existingUser: any;
    let updatedUser: any;

    beforeEach(()=> {
       existingUser = mockUsers[0];
       updatedUser = {...existingUser, name: 'Updated Name'};
      component.dataSource = [...mockUsers];
    })

    it('should open dialog and edit existing user', () => {
      dialog.open.and.returnValue({afterClosed: () => of(updatedUser)} as any);
      usersService.updateUser.and.returnValue(of(updatedUser));

      component.edit(existingUser);

      expect(dialog.open).toHaveBeenCalledOnceWith(UserFormDialogComponent, {
        width: '600px',
        data: {...existingUser}
      });
      expect(usersService.updateUser).toHaveBeenCalledOnceWith(0, updatedUser);
    });

    it('should handle error when updating user', () => {
      dialog.open.and.returnValue({afterClosed: () => of(updatedUser)} as any);
      usersService.updateUser.and.returnValue(throwError(() => new Error('Failed to update user')));

      component.edit(existingUser);

      expect(snackBarService.show).toHaveBeenCalledOnceWith('Failed to update user');
      expect(component.dataSource).toEqual(mockUsers);
    });

    it('should not update user if dialog is closed without result', () => {
      dialog.open.and.returnValue({afterClosed: () => of(null)} as any);

      component.edit(existingUser);

      expect(dialog.open).toHaveBeenCalledOnceWith(UserFormDialogComponent, {
        width: '600px',
        data: {...existingUser}
      });
      expect(usersService.updateUser).not.toHaveBeenCalled();
    });
  });
});
