import { Routes } from '@angular/router';
import {IterationResolver} from '../shared/resolver/iteration.resolver';
import {UserResolver} from '../shared/resolver/user.resolver';
import {TimeLogView} from './time-log-view/time-log-view';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => TimeLogView
  },
  {
    path: ':iteration/:user',
    loadComponent: () => TimeLogView,
    resolve: {
      user: UserResolver,
      iteration: IterationResolver
    }
  }
];
