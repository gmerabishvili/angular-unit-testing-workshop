import { fakeAsync, tick } from '@angular/core/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers = [
    { name: 'John Doe', email: 'test@gmail.com', role: 'Developer' },
    { name: 'Jane Air', email: 'test@gmail.com', role: 'HR' },
    { name: 'David August', email: 'test@gmail.com', role: 'QA' }
  ];

  const mockRoles: string[] = ['Developer', 'Designer', 'Manager', 'HR', 'QA'];

  beforeEach(() => {
    service = new UsersService();
  });

  describe('getUsers', () => {
    it('should return all users with delay', fakeAsync(() => {
      let result = [] as any;

      service.getUsers().subscribe(users => {
        result = users;
      });

      expect(result).toEqual([]);
      tick(800);
      expect(result).toEqual(mockUsers);
    }));
  });

  describe('addUser', () => {
    it('should add a new user and return it with delay', fakeAsync(() => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        role: 'Developer'
      } as any;

      let result: any;

      service.addUser(newUser).subscribe(user => {
        result = user;
      });

      expect(result).toBeUndefined();
      tick(500);
      expect(result).toEqual(newUser);


      let users = [] as any;
      service.getUsers().subscribe(list => {
        users = list;
      });
      tick(800);
      expect(users).toContain(newUser);
    }));
  });

  describe('updateUser', () => {
    it('should update an existing user and return it with delay', fakeAsync(() => {
      const updatedUser = {
        name: 'Updated Name',
        email: 'updated@example.com',
        role: 'Manager'
      } as any;

      let result: any;

      service.updateUser(0, updatedUser).subscribe(user => {
        result = user;
      });

      expect(result).toBeUndefined();
      tick(500);
      expect(result).toEqual(updatedUser);

      let users = [] as any;
      service.getUsers().subscribe(list => {
        users = list;
      });
      tick(800);
      expect(users[0]).toEqual(updatedUser);
    }));
  });

  describe('getRoles', () => {
    it('should return all roles with delay', fakeAsync(() => {
      let result: string[] = [];

      service.getRoles().subscribe(roles => {
        result = roles;
      });

      expect(result).toEqual([]);
      tick(300);
      expect(result).toEqual(mockRoles);
    }));
  });
});
