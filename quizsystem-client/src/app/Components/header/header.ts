import { Component } from '@angular/core';
import { HttpClientService } from '../../Services/HttpService/http-client-service';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [NgIf,AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isAuthenticated$ : Observable<boolean>;
  constructor(private http: HttpClientService, private router: Router) {
    this.isAuthenticated$ = this.http.isAuthenticated$;
  }

  logout() {
    this.http.logout();
    this.router.navigate(['/login']);
  }
}
