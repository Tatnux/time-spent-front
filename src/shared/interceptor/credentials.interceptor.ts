import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiUrl = request.url.startsWith('/api');
    if (isApiUrl) {
      request = request.clone({
        url: `${environment.protocol}://${environment.hostname}:${environment.port}${request.url}`,
        withCredentials: true
      })
    }

    return next.handle(request);
  }
}
