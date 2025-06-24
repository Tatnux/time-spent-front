import {Component, effect, input, Input, InputSignal, signal, WritableSignal} from '@angular/core';
import {IIteration} from '../../shared/models/iteration.model';
import {TimeLogChart} from '../time-log-chart/time-log-chart';
import {NzOptionComponent, NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../shared/service/auth.service';
import {formatDate} from '@angular/common';
import {UsersService} from '../../shared/service/users.service';
import {IterationService, iterationToUrl} from '../../shared/service/iteration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IGitlabUser, IUser} from '../../shared/models/user.model';

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
export class TimeLogView {

  user: InputSignal<IUser> = input();
  iteration: InputSignal<IIteration> = input();

  selectedUser: WritableSignal<IUser> = signal(undefined);
  selectedIteration: WritableSignal<IIteration> = signal(undefined);

  constructor(private readonly router: Router,
              readonly authService: AuthService,
              protected readonly usersService: UsersService,
              protected readonly iterationService: IterationService) {
    effect(() => {
      this.selectedUser.set(this.user() ?? usersService.users().find(value =>
        value.username === authService.currentUser()?.username));
      this.selectedIteration.set(this.iteration() ?? this.iterationService.currentIteration());
    });
    effect(() => {
      this.router.navigate([iterationToUrl(this.selectedIteration()), this.selectedUser().username]).catch(console.error);
    })
  }

  protected iterationDisplay(iteration: IIteration): string {
    const start = new Date(iteration.startDate);
    const end = new Date(iteration.dueDate);
    return `${this.formatIterationDate(start, start.getFullYear() !== end.getFullYear())} - ${this.formatIterationDate(end)}`
  }

  private formatIterationDate(date: Date, year: boolean = true): string {
    let format: string = 'MMM d'
    if(year) {
      format += ', yyyy';
    }
    return formatDate(date, format, 'en-US');
  }
}
