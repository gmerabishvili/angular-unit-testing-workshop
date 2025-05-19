import { Routes } from '@angular/router';
import {UsersListComponent} from './users-list/users-list.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'users-list'},
  {path: 'users-list', component: UsersListComponent},
];
