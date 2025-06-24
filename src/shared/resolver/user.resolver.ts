import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {UsersService} from '../service/users.service';
import {IGitlabUser} from '../models/user.model';
import {filter, map, Observable, of} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<IGitlabUser> {

  private readonly usersObservable: Observable<IGitlabUser[]>;

  constructor(private readonly usersService: UsersService) {
    this.usersObservable = toObservable(this.usersService.users);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IGitlabUser> {
    const user: string = route.paramMap.get('user');

    const observable: Observable<IGitlabUser[]> = this.usersService.users().length > 0 ? of(this.usersService.users()) :
      this.usersObservable;
    return observable.pipe(
      filter(value => value?.length > 0),
      map((users: IGitlabUser[]) => users.find((value: IGitlabUser) => user === value.username))
    )
  }
}
