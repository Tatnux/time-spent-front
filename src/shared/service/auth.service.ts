import {Injectable, OnInit, signal, WritableSignal} from '@angular/core';
import {IUser} from '../models/user.model';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private readonly subscription: Subscription = new Subscription();

  currentUser: WritableSignal<IUser> = signal(undefined);

  constructor(http: HttpClient) {
    this.subscription.add(
      http.get<IUser>('/api/user/me')
        .subscribe({
          next: (data) => {
            this.currentUser.set(data);
          },
          error: (err) => console.error('Non connecté', err)
        })
    );
  }
}
