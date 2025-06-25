import {Component, effect, input, InputSignal} from '@angular/core';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {SecondsToHoursPipe} from '../../../shared/pipe/secondes-to-hours.pipe';

@Component({
  selector: 'app-time-log-sum',
  imports: [
    NzTagComponent,
    SecondsToHoursPipe
  ],
  template: "<nz-tag [nzColor]=\"sum === 0 ? 'blue' : sum > 28800 ? 'red' : sum === 28800 ? 'green' : 'orange'\">{{ sum | secondsToHours}}</nz-tag>"
})
export class TimeLogSumComponent {

  timeLogs: InputSignal<{timeSpent: number}[]> = input();
  sum: number = 0;

  constructor() {
    effect(() => {
      this.sum = this.timeLogs().reduce((a, b) => a + b.timeSpent, 0);
    });
  }

}
