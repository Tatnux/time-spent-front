import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IIteration} from '../models/iteration.model';

@Injectable({
  providedIn: 'root'
})
export class IterationService implements OnDestroy {

  private readonly subscription: Subscription = new Subscription();

  readonly iterations: WritableSignal<IIteration[]> = signal([]);
  readonly currentIteration: WritableSignal<IIteration> = signal(undefined);

  constructor(private readonly http: HttpClient) {
    this.observeIterations()
  }

  observeIterations() {
    this.subscription.add(
      forkJoin([
        this.http.get<IIteration[]>('/api/iteration/current'),
        this.http.get<IIteration[]>('/api/iteration/closed')
      ]).subscribe({
        next: value => {
          this.currentIteration.set(value[0][0]);
          this.iterations.set([this.currentIteration(), ...value[1]].sort(this.sortFn));
        },
        error: err => console.error('Unable to get iterations', err)
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private sortFn(a: IIteration, b: IIteration) {
    return a.startDate.localeCompare(b.startDate) ? 1 : -1;
  }
}

export function iterationToUrl(iteration: IIteration): string {
  return iteration?.state === "current" ? "current" : iteration?.id.split('/').pop();
}
