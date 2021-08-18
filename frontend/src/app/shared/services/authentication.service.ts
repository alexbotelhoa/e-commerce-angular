import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { LoginModel } from '../../modules/auth/models/login.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<LoginModel>;
    public currentUser: Observable<LoginModel>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<LoginModel>(
            JSON.parse(localStorage.getItem('currentUser') as any)
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): LoginModel {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http
            .post<any>(`/users/authenticate`, { username, password })
            .pipe(
                map((user) => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }

                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null as any);
    }
}
