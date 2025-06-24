import {Component, effect, input, InputSignal, signal, WritableSignal} from '@angular/core';
import {ApexChart} from 'ng-apexcharts';
import {IIteration} from '../../shared/models/iteration.model';
import {ITimeLog} from '../../shared/models/time-log.model';
import {DatePipe, formatDate} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {SecondsToHoursPipe} from '../../shared/pipe/secondes-to-hours.pipe';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {ActivityIssuesModal, ActivityIssuesModalData} from '../activity-issues-modal/activity-issues-modal';
import {IGitlabUser, IUser} from '../../shared/models/user.model';
import {TimeLogSumComponent} from './time-log-sum.component';
import {UsersService} from '../../shared/service/users.service';
import {IterationService, iterationToUrl} from '../../shared/service/iteration.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  colors: any[];
  stroke: ApexStroke;
  legend: ApexLegend;
  annotations: ApexAnnotations;
};

export const options: Partial<ChartOptions> = {
  chart: {
    type: "bar",
    stacked: true,

  }
}

@Component({
  selector: 'app-time-log-chart',
  imports: [
    SecondsToHoursPipe,
    DatePipe,
    NzTagComponent,
    NzSpinComponent,
    NzIconDirective,
    TimeLogSumComponent
  ],
  templateUrl: './time-log-chart.html',
  styleUrl: './time-log-chart.scss'
})
export class TimeLogChart {

  user: InputSignal<IUser> = input();
  iteration: InputSignal<IIteration> = input();

  days: Map<string, ITimeLog[]> = new Map();
  loading: boolean = true;

  constructor(private readonly http: HttpClient,
              private readonly modalService: NzModalService) {
    effect(() => {
      this.iteration();
      this.fillWeekdaysBetween();
      this.fillTimeLogs();
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
              const existingLog: ITimeLog = logs.find(log => log.issue?.iid === timeLog.issue?.iid);
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
