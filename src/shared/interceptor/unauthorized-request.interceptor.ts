import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class UnauthorizedRequestInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status)) {
        window.location.href = 'http://localhost:8060/oauth2/authorization/gitlab';
      } else if (err.status === 0) {
        this.router.navigateByUrl('/api-error').catch(console.error);
      }

      return throwError(() => err);
    }))
  }
}
