import {Component, inject, OnInit} from '@angular/core';
import {ITimeLog} from '../../../../shared/models/time-log.model';
import {NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef, NzModalTitleDirective} from 'ng-zorro-antd/modal';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  IActivity,
  IActivityIssue,
  IDisplayActivity,
  Status,
  statusColor,
  statusOrder
} from '../../../../shared/models/activity.model';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {SecondsToHoursPipe} from '../../../../shared/pipe/secondes-to-hours.pipe';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {FormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AuthService} from '../../../../shared/service/auth.service';
import {DatePipe} from '@angular/common';
import {TimeLogSumComponent} from '../../timelogs/time-log-chart/time-log-sum.component';
import {TranslatePipe} from '@ngx-translate/core';
import {PluralizePipe} from '../../../../shared/pipe/pluralize.pipe';
import {UsernamePipe} from '../../../../shared/pipe/username.pipe';
import {IMergeRequest} from '../../../../shared/models/merge-request.model';
import {IIssue} from '../../../../shared/models/issue.model';
import {NzSkeletonComponent} from 'ng-zorro-antd/skeleton';
import {NzEmptyComponent} from 'ng-zorro-antd/empty';
import {IGitlabUser} from '../../../../shared/models/user.model';

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
    UsernamePipe,
    NzSkeletonComponent,
    NzEmptyComponent
  ],
  templateUrl: './activity-issues-modal.html',
  styleUrl: './activity-issues-modal.less'
})
export class ActivityIssuesModal implements OnInit {

  private readonly subscription: Subscription = new Subscription();

  data: ActivityIssuesModalData = inject(NZ_MODAL_DATA);

  issues: IActivityIssue[] = [undefined];

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
          error: (err) => console.error('An error occurred while getting the activity', err)
        })
    );
  }

  private updateActivities() {
    this.data.timeLogs.forEach(timeLog => {
      if(!this.issues.some(issue => timeLog?.issue?.id.endsWith(issue.issue?.id))) {
        this.issues.push({
          id: timeLog.issue.id,
          issue: timeLog.issue,
          activities: [],
          timeSpent: timeLog.timeSpent,
        })
      }
    })
    this.issues.forEach(issue => {
      issue.status = this.findStatus(issue);
      if(issue.issue) {
        issue.timeSpent = this.getTimeSpent(issue.issue);
        issue.timeInput = SecondsToHoursPipe.transform(issue.timeSpent);
      }
      this.updateDisplayActivities(issue);
    });
    this.sortIssues();
  }

  private updateDisplayActivities(issue: IActivityIssue) {
    issue.displayActivities = [];
    issue.activities.forEach(activity => {
      let name: string;
      let webUrl: string;
      let type: string;
      const targetIid: number = activity?.note?.noteableIid ?? activity.targetIid;
      // Pushed
      if(activity.pushData) {
        name = activity.pushData?.ref;
        type = 'branch';
      // Moved Issue
      } else if(issue.issue?.moved && issue.issue?.movedTo) {
        activity.actionName = 'moved';
        type = 'issue';
        const movedIssue: IActivityIssue = this.issues.find((value: IActivityIssue) => value.issue?.id === issue.issue.movedTo.id);
        if(movedIssue) {
          name = this.getProjectName(movedIssue.issue.webUrl) + '#' + movedIssue.issue.iid;
          webUrl = movedIssue.issue.webUrl;
        }
      // Issue Ref
      } else if(targetIid === issue.issue?.iid) {
        name = '#' + issue.issue.iid;
        webUrl = issue.issue.webUrl;
        type = 'issue';
      // Merge Request Ref
      } else {
        const mergeRequest: IMergeRequest = this.issues.flatMap(value => value.mergeRequest).find(value => value.iid === targetIid);
        if(mergeRequest) {
          name = '!' + mergeRequest.iid;
          webUrl = mergeRequest.webUrl;
          type = 'merge request';
        }
      }

      let displayActivity: IDisplayActivity = {
        actionName: activity.actionName,
        count: 0,
        name,
        webUrl,
        type,
        tooltips: []
      };

      let founded: IDisplayActivity = issue.displayActivities.find(value =>
        this.getActionPrefix(value.actionName) === this.getActionPrefix(displayActivity.actionName) &&
        value.type === displayActivity.type &&
        value.name === displayActivity.name);
      if(founded) {
        displayActivity = founded;
      } else {
        issue.displayActivities.push(displayActivity);
      }

      if(displayActivity.actionName.startsWith("pushed") && activity.pushData.commitTitle) {
        displayActivity.tooltips.push(activity.pushData.commitTitle)
      }

      displayActivity.count += activity.pushData?.commitCount ?? 1;
    })
  }

  getActionPrefix(actionName: string): string {
    return actionName.split(' ')[0];
  }

  getTimeSpent(issue: IIssue): number {
    return this.data.timeLogs?.find(value => value.issue?.id.endsWith(issue?.id))?.timeSpent ?? 0;
  }

  getProjectName(url: string) {
    const match: RegExpMatchArray = RegExp(/\/([^/]+)\/-\/(merge_requests|issues)\/\d+/).exec(url);
    return match ? match[1] : null;
  }

  convertToSeconds(duration: string): number {
    return SecondsToHoursPipe.parse(duration);
  }

  private findStatus(issue: IActivityIssue): Status {
    const entity: IIssue | IMergeRequest = issue.issue ?? issue.mergeRequest[0];

    if (issue.activities.some((activity: IActivity) => this.getActionPrefix(activity.actionName) === 'pushed') &&
      (entity.assignees.length === 0 || entity.assignees.some((value: IGitlabUser) => this.data.userId.endsWith(value.id)))) {
      return 'Development'
    }

    if(issue.activities.some(activity => ['closed', 'approved', 'accepted', 'commented on'].includes(activity.actionName))) {
      return 'Review'
    }

    return 'Other';
  }

  public close(): void {
    this.ref.destroy();
  }

  public validateChanges(): void {
    const requests: Observable<Object>[] = this.issues
      .filter((issue: IActivityIssue) => issue.issue)
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

  sortIssues(): void {
    this.issues.sort((a: IActivityIssue, b: IActivityIssue) => {
      if(a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }

      return (b.timeSpent ?? 0) - (a.timeSpent ?? 0);
    });
  }

  protected readonly statusColor = statusColor;
}

