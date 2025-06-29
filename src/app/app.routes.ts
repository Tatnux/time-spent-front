import { Routes } from '@angular/router';
import {IterationResolver} from '../shared/resolver/iteration.resolver';
import {UserResolver} from '../shared/resolver/user.resolver';
import {TimeLogView} from './components/timelogs/time-log-view/time-log-view';
import {IterationFormatPipe} from '../shared/pipe/iteration-format.pipe';
import {BurndownViewComponent} from './components/burndown/burndown-view/burndown-view.component';
import {PresenceBoard} from './components/presence/presence-board/presence-board';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => TimeLogView
  },
  {
    path: 'burndown',
    loadComponent: () => BurndownViewComponent,
  },
  {
    path: 'presence-board',
    loadComponent: () => PresenceBoard,
  },
  {
    path: ':iteration',
    loadComponent: () => TimeLogView,
    resolve: {
      iteration: IterationResolver
    },
    children: [
      {
        path: ':user',
        loadComponent: () => TimeLogView,
        resolve: {
          user: UserResolver,
        }
      }
    ]
  }
];
