import {Component, effect, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IIteration} from '../../shared/models/iteration.model';
import {TimeLogChart} from '../time-log-chart/time-log-chart';
import {IGitlabUser, IUser} from '../../shared/models/user.model';
import {NzOptionComponent, NzSelectComponent, NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../shared/service/auth.service';

@Component({
  selector: 'app-time-log-view',
  imports: [
    TimeLogChart,
    NzSelectModule,
    NzOptionComponent,
    FormsModule
  ],
  templateUrl: './time-log-view.html',
  styleUrl: './time-log-view.scss'
})
export class TimeLogView implements OnInit {

  private readonly subscription: Subscription = new Subscription();

  protected users: IGitlabUser[];
  protected iteration: IIteration;
  protected iterations: IIteration[] = [];
  selectedUser: IUser;


  constructor(private readonly http: HttpClient,
              private readonly authService: AuthService) {
  }

  ngOnInit() {
    this.subscription.add(
      this.http.get<IIteration[]>('/api/iteration/current')
        .subscribe({
          next: (data) => {
            this.iteration = data[0];
            this.iterations.push(this.iteration);
            this.sortIteration();
          },
          error: (err) => console.error('Non connecté', err)
        })
    );

    this.subscription.add(
      this.http.get<IIteration[]>('/api/iteration/closed')
        .subscribe({
          next: (data) => {
            this.iterations.push(...data);
            this.sortIteration();
          },
          error: (err) => console.error('Non connecté', err)
        })
    );

    this.subscription.add(
      this.http.get<IGitlabUser[]>('/api/users', { withCredentials: true })
        .subscribe({
          next: (data: IGitlabUser[]) => {
            this.users = data;
            this.selectedUser = this.users.find((value: IGitlabUser) => value.username === this.authService.currentUser().username);
          },
          error: (err) => console.error('Non connecté', err)
        })
    );

    this.subscription.add(
      this.http.get('/api/user/token', { responseType: 'text' })
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (err) => console.error('Non connecté', err)
        })
    );
  }

  private sortIteration() {
    this.iterations.sort((a, b) => a?.startDate.localeCompare(b?.startDate) ? -1 : 1);
  }


}
