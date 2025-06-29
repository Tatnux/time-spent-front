import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IIteration} from '../models/iteration.model';
import {IIssue, IIterationIssue} from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IterationService implements OnDestroy {

  private readonly subscription: Subscription = new Subscription();

  readonly iterations: WritableSignal<IIteration[]> = signal([]);
  readonly currentIteration: WritableSignal<IIteration> = signal(undefined);

  readonly selectedIteration: WritableSignal<IIteration> = signal(undefined);

  constructor(private readonly http: HttpClient) {
    this.observeIterations()
  }

  observeIterations() {
    this.subscription.add(
      forkJoin([
        this.http.get<IIteration[]>('/api/iteration/current?first=1'),
        this.http.get<IIteration[]>('/api/iteration/closed?first=12'),
        this.http.get<IIteration[]>('/api/iteration/next?first=1'),
      ]).subscribe({
        next: value => {
          this.currentIteration.set(value[0][0]);
          this.iterations.set([this.currentIteration(), ...value[1], ...value[2]].sort(this.sortFn));
        },
        error: err => console.error('Unable to get iterations', err)
      })
    );
  }

  public getIssues(iteration: IIteration) {
    return this.http.get<IIterationIssue[]>(`/api/iteration/${iteration.id.split('/').pop()}/issues`);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private sortFn(a: IIteration, b: IIteration) {
    return b.startDate.localeCompare(a.startDate);
  }
}

export function iterationToUrl(iteration: IIteration): string {
  if(iteration?.state === 'current') {
    return 'current';
  }
  if(iteration?.state === 'upcoming') {
    return 'next'
  }
  return iteration?.id.split('/').pop();
}
