import {effect, Injectable, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Subscription} from 'rxjs';
import {IGitlabUser} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnDestroy {

  private readonly subscription: Subscription = new Subscription();

  readonly users: WritableSignal<IGitlabUser[]> = signal([]);

  constructor(private readonly http: HttpClient) {
    effect(() => {
      this.subscription.add(
        this.http.get<IGitlabUser[]>('/api/users').subscribe({
          next: (data: IGitlabUser[]) => this.users.set(data),
          error: (err) => console.error('Unable to get users list', err)
        })
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
