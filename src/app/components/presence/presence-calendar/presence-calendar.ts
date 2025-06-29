import { Component } from '@angular/core';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {CalendarService} from '../../../../shared/service/calendar.service';

@Component({
  selector: 'app-presence-calendar',
  imports: [
    NzTooltipDirective
  ],
  templateUrl: './presence-calendar.html',
  styleUrl: './presence-calendar.less'
})
export class PresenceCalendar {

  dates: Date[][] = [];

  constructor(protected readonly calendarService: CalendarService) {
    this.generateWorkdaysAroundToday();
  }

  generateWorkdaysAroundToday(): void {
    const today = new Date();
    this.dates = [];

    const start = new Date(today);
    start.setMonth(start.getMonth() - 6);

    const end = new Date(today);
    end.setMonth(end.getMonth() + 6);


    // while (start.getDay() !== 1) {
    //   start.setDate(start.getDate() - 1);
    // }
    //
    // while (end.getDay() !== 5) {
    //   end.setDate(end.getDate() + 1);
    // }

    let current: Date = new Date(start);
    let week: Date[] = [];

    while (current <= end) {
      const day = current.getDay();

      // Working days only
      if (day >= 1 && day <= 5) {
        week[day - 1] = new Date(current);
      }

      if (day === 5) {
        this.dates.push(week);
        week = [];
      }

      current.setDate(current.getDate() + 1);
    }
  }

}
