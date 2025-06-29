import {Component, effect} from '@angular/core';
import {NzContentComponent, NzLayoutComponent, NzLayoutModule, NzSiderComponent} from 'ng-zorro-antd/layout';
import {NzMenuDirective, NzMenuItemComponent, NzMenuModule, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {IterationService, iterationToUrl} from '../../shared/service/iteration.service';
import {IterationFormatPipe} from '../../shared/pipe/iteration-format.pipe';
import {UsersService} from '../../shared/service/users.service';
import {Title} from '@angular/platform-browser';
import {UsernamePipe} from '../../shared/pipe/username.pipe';
import {ThemeService} from '../../shared/service/theme.service';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Dev} from '../../shared/directives/dev';
import {AuthService} from '../../shared/service/auth.service';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-layout',
  imports: [
    NzLayoutModule,
    NzMenuModule,
    RouterOutlet,
    IterationFormatPipe,
    NzIconDirective,
    RouterLink,
    Dev,
    UsernamePipe,
    NzAvatarComponent
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

  constructor(private readonly router: Router,
              private readonly title: Title,
              private readonly themeService: ThemeService,
              protected readonly usersService: UsersService,
              protected readonly iterationService: IterationService) {
    effect(() => {
      const iteration = this.iterationService.selectedIteration();
      const user = this.usersService.selectedUser();

      if(iteration && user) {
        this.router.navigate([iterationToUrl(iteration), user.username]).catch(console.error);
        this.title.setTitle(`${IterationFormatPipe.transform(iteration, false)} | ${UsernamePipe.transform(user.username)}`)
      }
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then();
}

  protected readonly iterationToUrl = iterationToUrl;
}
