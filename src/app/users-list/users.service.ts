import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  name: string;
  email: string;
  role: string;
}

const USER_DATA: User[] = [
  { name: 'John Doe', email: 'test@gmail.com', role: 'Developer' },
  { name: 'Jane Air', email: 'test@gmail.com', role: 'HR' },
  { name: 'David August', email: 'test@gmail.com', role: 'QA' }
];

const ROLES_DATA: string[] = ['Developer', 'Designer', 'Manager', 'HR', 'QA'];

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [...USER_DATA];
  private roles: string[] = [...ROLES_DATA];

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(800));
  }

  addUser(user: User): Observable<User> {
    this.users.push(user);
    return of(user).pipe(delay(500));
  }

  updateUser(index: number, updatedUser: User): Observable<User> {
    this.users[index] = updatedUser;
    return of(updatedUser).pipe(delay(500));
  }

  getRoles(): Observable<string[]> {
    return of(this.roles).pipe(delay(300));
  }
}
