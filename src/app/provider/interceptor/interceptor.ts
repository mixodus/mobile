// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable,throwError } from 'rxjs';
import { _throw } from 'rxjs/observable/throw';
import { map,catchError, mergeMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import 'rxjs/add/observable/fromPromise';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';
@Injectable()
export class InterceptorProvider implements HttpInterceptor {

    constructor(private storage: Storage, private alertCtrl: AlertController, private globalService: GlobalService, private router : Router,) { }

    // Intercepts all HTTP requests!
    /*
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        
        let promise = this.storage.get(this.globalService.getTokenName());
        return Observable.fromPromise(promise).pipe(
            mergeMap(token => {
                
                let clonedReq = this.addToken(request, token);
                console.log("interceptor clonedReq",clonedReq);
                return next.handle(clonedReq).pipe(
                    catchError(error => {
                        // Perhaps display an error for specific status codes here already?
                        let msg = error.message;

                        console.log("error interceptor", msg);
                        alert("error " + msg);

                        // Pass the error to the caller of the function
                        return _throw(error);
                    })
                );
            })); 
        

      
    } */

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        
        
        const token = localStorage.getItem(this.globalService.getTokenName());
        console.log("intercept token", token);
        if (token) {
          request = request.clone({
            setHeaders: {
              'Authorization': token
            }
          });
        }
      
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
      
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
        
        console.log("intercept http");
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('event--->>>', event);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
              console.log("error intercept");
            if (error.status === 401) {
              if (error.error.success === false) {
                // this.presentToast('Login failed');
                console.log("login failed");
              } else {
                // this.router.navigate(['login']);
                 console.log("go to login page");
              }
            }
            return throwError(error);
          }));
      }

    // Adds the token to your headers if it exists
    private addToken(request: HttpRequest<any>, token: any) {
        if (token) {
            let clone: HttpRequest<any>;
            clone = request.clone({
                setHeaders: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token.token
                }
            });
            return clone;
        }

        return request;
    }
}