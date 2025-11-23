import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  user  = signal<User | null>(null);
  
  login(email:string,password:string) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`,{
      email: email,
      password: password
    },{
      withCredentials: true
    }).pipe(
      tap((userResponse) => this.user.set(userResponse))
    )
  }
}
