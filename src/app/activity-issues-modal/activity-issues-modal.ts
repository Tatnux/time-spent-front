import {Component, inject, OnInit} from '@angular/core';
import {ITimeLog} from '../../shared/models/time-log.model';
import {NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef, NzModalTitleDirective} from 'ng-zorro-antd/modal';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {IActivityIssue, IDisplayActivity} from '../../shared/models/activity.model';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {SecondsToHoursPipe} from '../../shared/pipe/secondes-to-hours.pipe';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AuthService} from '../../shared/service/auth.service';
import {DatePipe} from '@angular/common';
import {TimeLogSumComponent} from '../time-log-chart/time-log-sum.component';
import {TranslatePipe} from '@ngx-translate/core';
import {PluralizePipe} from '../../shared/pipe/pluralize.pipe';
import {UsernamePipe} from '../../shared/pipe/username.pipe';
import {IMergeRequest} from '../../shared/models/merge-request.model';
import {IIssue} from '../../shared/models/issue.model';

export interface ActivityIssuesModalData {
  userId: string;
  day: string;
  timeLogs: ITimeLog[];
  updateTimeLog: () => void;
}

export interface ITimeLogUpdate {
  issueId: string;
  timeSpent: number;
  spentAt: string;
}

@Component({
  selector: 'app-activity-issues-modal',
  imports: [
    NzSpinComponent,
    NzTagComponent,
    SecondsToHoursPipe,
    NzIconDirective,
    NzTooltipDirective,
    NzInputDirective,
    FormsModule,
    NzButtonComponent,
    NzModalFooterDirective,
    NzModalTitleDirective,
    DatePipe,
    TimeLogSumComponent,
    TranslatePipe,
    PluralizePipe,
    UsernamePipe
  ],
  templateUrl: './activity-issues-modal.html',
  styleUrl: './activity-issues-modal.scss'
})
export class ActivityIssuesModal implements OnInit {

  private readonly subscription: Subscription = new Subscription();

  data: ActivityIssuesModalData = inject(NZ_MODAL_DATA);

  issues: IActivityIssue[];

  confirmLoading = false;

  constructor(private readonly http: HttpClient,
              private readonly ref: NzModalRef,
              protected readonly authService: AuthService){
  }

  ngOnInit() {
    this.subscription.add(
      this.http.get<IActivityIssue[]>('/api/activity', { params:
          {
            day: this.data.day,
            userId: this.data.userId.split('/').pop()
          }
      }).subscribe({
          next: (data: IActivityIssue[]) => {
            this.issues = data;
            this.updateActivities();
          },
          error: (err) => console.error('Non connecté', err)
        })
    );
  }

  private updateActivities() {
    this.data.timeLogs.forEach(timeLog => {
      if(!this.issues.some(issue => timeLog?.issue?.id.endsWith(issue.issue.id))) {
        this.issues.push({
          issue: timeLog.issue,
          activities: [],
          timeSpent: timeLog.timeSpent,
        })
      }
    })
    this.issues.forEach(issue => {
      issue.dev = issue.activities.some(activity => this.getActionPrefix(activity.actionName) === 'pushed') &&
        (!issue.issue.assignees[0] || this.data.userId.endsWith(issue.issue.assignees[0].id));
      issue.timeSpent = this.getTimeSpent(issue.issue);
      issue.timeInput = SecondsToHoursPipe.transform(issue.timeSpent);
      this.updateDisplayActivities(issue);
    });
    this.issues.sort(a => a.dev ? -1 : 1)
  }

  private updateDisplayActivities(issue: IActivityIssue) {
    issue.displayActivities = [];
    issue.activities.forEach(activity => {
      let displayActivity: IDisplayActivity = issue.displayActivities.find(value => value.actionName.startsWith(this.getActionPrefix(activity.actionName)));
      if(!displayActivity) {
        let name: string;
        let webUrl: string;
        let type: string;
        const targetIid: number = activity?.note?.noteableIid ?? activity.targetIid;
        // Pushed
        if(activity.pushData) {
          name = activity.pushData?.ref;
          type = 'branch';
        // Moved Issue
        } else if(issue.issue.moved) {
          activity.actionName = 'moved';
          const movedIssue: IActivityIssue = this.issues.find((value: IActivityIssue) => value.issue.id === issue.issue.movedTo.id);
          if(movedIssue) {
            name = this.getProjectName(movedIssue.issue.webUrl) + '#' + movedIssue.issue.iid;
            webUrl = movedIssue.issue.webUrl;
            type = 'issue';
          }
        // Issue Ref
        } else if(targetIid === issue.issue?.iid) {
          name = '#' + issue.issue.iid;
          webUrl = issue.issue.webUrl;
          type = 'issue';
        // Merge Request Ref
        } else {
          const mergeRequest: IMergeRequest = issue.mergeRequest.find(value => value.iid === targetIid);
          if(mergeRequest) {
            name = '!' + mergeRequest.iid;
            webUrl = mergeRequest.webUrl;
            type = 'merge request';
          }
        }

        displayActivity = {
          actionName: activity.actionName,
          count: 0,
          name,
          webUrl,
          type,
          tooltips: []
        };

        issue.displayActivities.push(displayActivity);
      }

      if(displayActivity.actionName.startsWith("pushed")) {
        displayActivity.tooltips.push(activity.pushData.commitTitle)
      }

      displayActivity.count += activity.pushData?.commitCount ?? 1;
    })
  }

  getActionPrefix(actionName: string): string {
    return actionName.split(' ')[0];
  }

  getTimeSpent(issue: IIssue): number {
    return this.data.timeLogs?.find(value => value.issue.id.endsWith(issue.id))?.timeSpent ?? 0;
  }

  getProjectName(url: string) {
    const match: RegExpMatchArray = RegExp(/\/([^/]+)\/-\/(merge_requests|issues)\/\d+/).exec(url);
    return match ? match[1] : null;
  }

  convertToSeconds(duration: string): number {
    const match = RegExp(/(?:(\d+)h)?(?:(\d+)m)?/i).exec(duration.replace(/\s+/g, ''));

    if (!match) return 0;

    const hours = parseInt(match[1] ?? '0', 10);
    const minutes = parseInt(match[2] ?? '0', 10);

    return hours * 3600 + minutes * 60;
  }

  public close(): void {
    this.ref.destroy();
  }

  public validateChanges(): void {
    const requests: Observable<Object>[] = this.issues
      .map((value: IActivityIssue) => {
        const seconds: number = this.convertToSeconds(value.timeInput);
        const timeSpent: number = this.getTimeSpent(value.issue);
        return {timeSpent: seconds - timeSpent, issueId: value.issue.id, spentAt: this.data.day};
      })
      .filter((value: ITimeLogUpdate) => value.timeSpent !== 0)
      .map((value: ITimeLogUpdate) => this.http.post('/api/timespent/create', {timeSpent: SecondsToHoursPipe.transform(value.timeSpent, false), issueId: value.issueId, spentAt: value.spentAt}));

    if (requests.length === 0) {
      this.close();
      return
    }

    this.confirmLoading = true;
    this.subscription.add(
      forkJoin(requests).subscribe({
        next: () => {
          this.confirmLoading = false;
          this.data.updateTimeLog();
          this.close();
        },
        error: (err) => {
          console.log(err)
          this.confirmLoading = false;
        }
      })
    );
  }

  getCurrentTimeSpent(): { timeSpent: number }[] {
    return this.issues?.filter(value => value.timeInput).map(value => ({timeSpent: this.convertToSeconds(value.timeInput)})) ?? [];
  }
}
