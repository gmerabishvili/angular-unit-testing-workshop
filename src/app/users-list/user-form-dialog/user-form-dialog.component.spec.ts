import { UserFormDialogComponent } from './user-form-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { User, UsersService } from '../users.service';
import { of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let dialogRef!: jasmine.SpyObj<MatDialogRef<UserFormDialogComponent>>;
  let usersService!: jasmine.SpyObj<UsersService>;
  let formBuilder: FormBuilder;

  const mockUser: User = {
    name: 'Gio Mera',
    email: 'gio@example.com',
    role: 'Admin'
  };

  const mockRoles = ['Admin', 'User', 'Manager'];

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    usersService = jasmine.createSpyObj('UsersService', ['getRoles']);
    usersService.getRoles.and.returnValue(of(mockRoles));
    formBuilder = new FormBuilder();

    component = new UserFormDialogComponent(
      formBuilder,
      usersService,
      dialogRef,
      mockUser
    );
  });

  describe('ngOnInit', () => {
    it('should initialize form with dialog data', () => {
      component.ngOnInit();

      expect(component.form.get('name')?.value).toEqual(mockUser.name);
      expect(component.form.get('email')?.value).toEqual(mockUser.email);
      expect(component.form.get('role')?.value).toEqual(mockUser.role);
    });

    it('should initialize form with empty values when no data provided', () => {
      const emptyUser = {} as User;
      component = new UserFormDialogComponent(
        formBuilder,
        usersService,
        dialogRef,
        emptyUser
      );
      component.ngOnInit();

      expect(component.form.get('name')?.value).toEqual('');
      expect(component.form.get('email')?.value).toEqual('');
      expect(component.form.get('role')?.value).toEqual('');
    });

    it('should load roles and initialize filtered roles', () => {
      component.ngOnInit();

      expect(usersService.getRoles).toHaveBeenCalledOnceWith();
      expect(component.roleOptions).toEqual(mockRoles);
    });
  });

  describe('submit', () => {
    it('should close dialog with form data when form is valid', () => {
      component.ngOnInit();
      component.form.setValue({
        name: 'New Name',
        email: 'new@example.com',
        role: 'User'
      });

      component.submit();

      expect(dialogRef.close).toHaveBeenCalledOnceWith({
        name: 'New Name',
        email: 'new@example.com',
        role: 'User'
      });
    });

    it('should not close dialog when form is invalid', () => {
      component.form = formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]]
      });

      component.form.setValue({
        name: '',
        email: 'invalid-email',
        role: ''
      });

      component.submit();

      expect(component.form.valid).toBeFalse();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('role filtering', () => {
    it('should filter roles when typing in role field', fakeAsync(() => {
      component.ngOnInit();

      let filteredRoles: string[] = [];
      component.filteredRoles.subscribe(filtered => {
        filteredRoles = filtered;
      });

      component.form.get('role')?.setValue('admin');
      tick();

      expect(filteredRoles).toEqual(['Admin']);
    }));

    it('should show all roles when role field is empty', fakeAsync(() => {
      component.ngOnInit();

      let filteredRoles: string[] = [];
      component.filteredRoles.subscribe(filtered => {
        filteredRoles = filtered;
      });


      component.form.get('role')?.setValue('');
      tick();

      expect(filteredRoles).toEqual(mockRoles);
    }));

    it('should show no roles when no matches found', fakeAsync(() => {
      component.ngOnInit();

      let filteredRoles: string[] = [];
      component.filteredRoles.subscribe(filtered => {
        filteredRoles = filtered;
      });


      component.form.get('role')?.setValue('test');
      tick();

      expect(filteredRoles).toEqual([]);
    }));
  });
});
