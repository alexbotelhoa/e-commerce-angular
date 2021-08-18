import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginModel } from '../../modules/login/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<LoginModel[]>(`/auth`);
  }

  getById(id: number) {
    return this.http.get(`/auth/` + id);
  }

  register(user: LoginModel) {
    return this.http.post(`/auth/register`, user);
  }

  update(user: LoginModel) {
    return this.http.put(`/auth/` + user.id, user);
  }

  delete(id: number) {
    return this.http.delete(`/auth/` + id);
  }
}
