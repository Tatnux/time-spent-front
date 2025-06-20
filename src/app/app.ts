import {Component} from '@angular/core';
import {TimeLogView} from './time-log-view/time-log-view';

@Component({
  selector: 'app-root',
  imports: [
    TimeLogView
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App  {
  protected title = 'time-spent';
}
