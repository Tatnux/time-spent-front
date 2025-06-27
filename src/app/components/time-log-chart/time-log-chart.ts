import {Component, effect, input, InputSignal, Signal} from '@angular/core';
import {IIteration} from '../../../shared/models/iteration.model';
import {ITimeLog} from '../../../shared/models/time-log.model';
import {DatePipe, formatDate} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {SecondsToHoursPipe} from '../../../shared/pipe/secondes-to-hours.pipe';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {ActivityIssuesModal, ActivityIssuesModalData} from '../activity-issues-modal/activity-issues-modal';
import {IUser} from '../../../shared/models/user.model';
import {TimeLogSumComponent} from './time-log-sum.component';
import {NzSkeletonComponent} from 'ng-zorro-antd/skeleton';
import {UsersService} from '../../../shared/service/users.service';
import {IterationService} from '../../../shared/service/iteration.service';

@Component({
  selector: 'app-time-log-chart',
  imports: [
    SecondsToHoursPipe,
    DatePipe,
    NzTagComponent,
    NzIconDirective,
    TimeLogSumComponent,
    NzSkeletonComponent
  ],
  templateUrl: './time-log-chart.html',
  styleUrl: './time-log-chart.scss'
})
export class TimeLogChart {

  user: Signal<IUser>;
  iteration: Signal<IIteration>;

  days: Map<string, ITimeLog[]> = new Map();
  loading: boolean = true;

  constructor(usersService: UsersService, iterationService: IterationService,
              private readonly http: HttpClient,
              private readonly modalService: NzModalService) {
    this.user = usersService.selectedUser;
    this.iteration = iterationService.selectedIteration;
    effect(() => {
      if(this.user() && this.iteration()) {
        this.fillWeekdaysBetween();
        this.fillTimeLogs();
      }
    });
  }

  private fillWeekdaysBetween(): void {
    this.days.clear();
    const startDate = new Date(this.iteration().startDate);
    const endDate = new Date(this.iteration().dueDate);

    for(let date: Date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const day: number = date.getDay();
      if(day !== 0 && day !== 6) {
        this.days.set(this.dateToKey(date), []);
      }
    }
  }

  private fillTimeLogs(): void {
    this.loading = true;
    this.http.get<ITimeLog[]>('/api/timespent',
      { params:
          {
            username: this.user().username,
            startTime: this.iteration().startDate,
            endTime: this.iteration().dueDate
          }
      })
      .subscribe({
        next: (data: ITimeLog[]) => {
          data.filter((value: ITimeLog) => value.issue).forEach((timeLog: ITimeLog) => {
            const date: string = this.dateToKey(timeLog.spentAt);
            if(this.days.has(date)) {
              const logs: ITimeLog[] = this.days.get(date);
              const existingLog: ITimeLog = logs.find(log => log.issue?.id === timeLog.issue?.id);
              if(existingLog) {
                existingLog.timeSpent += timeLog.timeSpent;
              } else {
                logs.push(timeLog);
              }

            }
          });
          this.loading = false;
          for (let value of this.days.values()) {
            value.sort((a, b) => b.timeSpent - a.timeSpent );
          }
        },
        error: (err) => {
          console.error('Unable to get time logs', err);
          this.loading = false;
        }
      });
  }

  private dateToKey(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  openEditModal(day: string) {
    if(this.isEditable(day)) {
      const data: ActivityIssuesModalData = {
        userId: this.user().id,
        day: day,
        timeLogs: this.days.get(day),
        updateTimeLog: () => {
          this.fillWeekdaysBetween();
          this.fillTimeLogs();
        }
      }
      this.modalService.create({
        nzContent: ActivityIssuesModal,
        nzData: data,
        nzWidth: 'fit-content',
        nzCloseIcon: null
      })
    }
  }

  isEditable(date: string) {
    const inputDate = new Date(date);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate <= today;
  }
}
