import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import * as jwt_decode from 'jwt-decode';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenChangeInterceptor implements HttpInterceptor {

  constructor(private msalService: MsalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const account = this.msalService.instance.getActiveAccount();
    if (!account || !request.headers.has('x-Flatten')){
      return next.handle(request);  
    }
    // request.headers.get('Authorization')
    const token = this.getAccessToken(request);
    const alteredToken = this.alterToken(token);
    if (alteredToken){
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${alteredToken}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  }
  
  private getAccessToken(request: HttpRequest<any>) {
    const account = this.msalService.instance.getActiveAccount();
    if (account){
      
    }
    const token = request.headers.get('Authorization')?.split(' ')[1];
    return token ?? '';
  }

  private alterToken(token: string) {
    if (!token){
      return '';
    }
    const tokenLength = token.length;
    const regex = new RegExp(`.$`);
    token = token.replace(regex, 'A');
    // const decoded = jwt_decode.jwtDecode(token);
    // decoded['sub'] = '103';
    
    // const alteredToken = jwt.sign(decoded, 'my-secret-key', { algorithm: 'HS256'});

    return token;
     
  }
}
