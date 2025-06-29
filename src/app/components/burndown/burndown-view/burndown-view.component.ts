import {Component, computed, effect, Signal, signal, WritableSignal} from '@angular/core';
import {IBurndownIssue, IIterationIssue} from '../../../../shared/models/issue.model';
import {IterationService} from '../../../../shared/service/iteration.service';
import {Subscription} from 'rxjs';
import {LabelDisplay} from '../../../../shared/components/label-display/label-display.component';
import {IIteration} from '../../../../shared/models/iteration.model';
import {SecondsToHoursPipe} from '../../../../shared/pipe/secondes-to-hours.pipe';

@Component({
  selector: 'app-burndown-view',
  imports: [
    LabelDisplay,
    SecondsToHoursPipe
  ],
  templateUrl: './burndown-view.component.html',
  styleUrl: './burndown-view.component.less'
})
export class BurndownViewComponent {

  private readonly subscription: Subscription = new Subscription();

  iteration: Signal<IIteration> = signal(undefined);

  issues: WritableSignal<IIterationIssue[]> = signal(undefined);

  closedIssues: Signal<IBurndownIssue[]> = computed(() => this.issues()
    ?.filter((issue: IIterationIssue) => issue.closedAt)
    .map(value => this.toBurndownIssue(value)));

  openIssues: Signal<IBurndownIssue[]> = computed(() => this.issues()
    ?.filter((issue: IIterationIssue) => !issue.closedAt)
    .map(value => this.toBurndownIssue(value)));

  constructor(private readonly iterationService: IterationService) {
    this.iteration = iterationService.currentIteration;
    effect(() => {
      const iteration = this.iteration();
      if(iteration) {
        this.subscription.add(iterationService.getIssues(iteration).subscribe({
          next: (data) => {
            this.issues.set(data);
          },
          error: (err) => {
            console.error(err);
          }
        }))
      }
    });
  }

  private toBurndownIssue(issue: IIterationIssue): IBurndownIssue {
    let spentTime: number = 0;
    let spentTimeInIteration: number = 0;

    const startDate = new Date(this.iteration().startDate);
    const endDate = new Date(this.iteration().dueDate);

    issue.timelogs.forEach((timelog) => {
      spentTime += timelog.timeSpent;
      const spentAt = new Date(timelog.spentAt);
      if(spentAt >= startDate && spentAt <= endDate) {
        spentTimeInIteration += timelog.timeSpent
      }
    })

    return {issue: issue, spentTime, spentTimeInIteration};
  }

}
