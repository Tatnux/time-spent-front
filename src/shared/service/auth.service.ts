import {effect, Injectable, OnInit, signal, untracked, WritableSignal} from '@angular/core';
import {IGitlabUser, IUser} from '../models/user.model';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from './users.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private readonly subscription: Subscription = new Subscription();

  currentUser: WritableSignal<IUser> = signal(undefined);

  constructor(http: HttpClient, userService: UsersService) {
    effect(() => {
      const user: IGitlabUser = userService.users()?.find(value => value.username === this.currentUser()?.username);
      if(user) {
        user.avatarUrl = this.currentUser()?.avatarUrl;
        this.currentUser.set(user);
        userService.currentUser.set(user);
      }
    });
    this.subscription.add(
      http.get<IUser>('/api/users/me')
        .subscribe({
          next: (data) => {
            this.currentUser.set(data);
          },
          error: (err) => console.error('Unable to get current user', err)
        })
    );
    if(environment.hostname === 'localhost') {
      this.subscription.add(
        http.get('/api/users/token', {responseType: 'text'})
          .subscribe({
            next: (data) => {
              console.log(data);
            },
            error: (err) => console.error('Unable to get current user', err)
          })
      );
    }
  }
}
