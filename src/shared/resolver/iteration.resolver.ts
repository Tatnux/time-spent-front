import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {IIteration} from '../models/iteration.model';
import {IterationService, iterationToUrl} from '../service/iteration.service';
import {Injectable} from '@angular/core';
import {filter, map, Observable, of} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: "root",
})
export class IterationResolver implements Resolve<IIteration> {

  private readonly iterationObservable: Observable<IIteration[]>;

  constructor(private readonly iterationService: IterationService) {
    this.iterationObservable = toObservable(this.iterationService.iterations);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IIteration> {
    const iteration: string = route.paramMap.get('iteration');

    const observable: Observable<IIteration[]> = this.iterationService.iterations().length > 0 ? of(this.iterationService.iterations()) :
      this.iterationObservable;
    return observable.pipe(
      filter(value => value?.length > 0),
      map((users: IIteration[]) => users.find(value => iteration === iterationToUrl(value))
    ));
  }
}
