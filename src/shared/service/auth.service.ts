import {effect, Injectable, OnInit, signal, untracked, WritableSignal} from '@angular/core';
import {IGitlabUser, IUser} from '../models/user.model';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private readonly subscription: Subscription = new Subscription();

  currentUser: WritableSignal<IUser> = signal(undefined);

  constructor(http: HttpClient, userService: UsersService) {
    effect(() => {
      const user: IGitlabUser = userService.users()?.find(value => value.username === untracked(() => this.currentUser())?.username);
      if(user) {
        this.currentUser.set(user);
      }
    });
    this.subscription.add(
      http.get<IUser>('/api/user/me')
        .subscribe({
          next: (data) => {
            this.currentUser.set(data);
          },
          error: (err) => console.error('Unable to get current user', err)
        })
    );
  }
}
