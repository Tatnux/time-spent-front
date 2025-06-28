import {Component, effect, input, InputSignal} from '@angular/core';
import {IIteration} from '../../../shared/models/iteration.model';
import {TimeLogChart} from '../time-log-chart/time-log-chart';
import {NzOptionComponent, NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {UsersService} from '../../../shared/service/users.service';
import {IterationService, iterationToUrl} from '../../../shared/service/iteration.service';
import {Router} from '@angular/router';
import {IUser} from '../../../shared/models/user.model';
import {UsernamePipe} from '../../../shared/pipe/username.pipe';
import {IterationFormatPipe} from '../../../shared/pipe/iteration-format.pipe';

@Component({
  selector: 'app-time-log-view',
  imports: [
    TimeLogChart,
    NzSelectModule,
    NzOptionComponent,
    FormsModule,
    UsernamePipe,
    IterationFormatPipe
  ],
  templateUrl: './time-log-view.html',
  styleUrl: './time-log-view.less'
})
export class TimeLogView {

  user: InputSignal<IUser> = input();
  iteration: InputSignal<IIteration> = input();

  constructor(private readonly router: Router,
              readonly authService: AuthService,
              protected readonly usersService: UsersService,
              protected readonly iterationService: IterationService) {
    effect(() => {
      this.usersService.selectedUser.set(this.user() ?? usersService.users().find(value =>
        value.username === authService.currentUser()?.username));
      this.iterationService.selectedIteration.set(this.iteration() ?? this.iterationService.currentIteration());
    });
  }
}
