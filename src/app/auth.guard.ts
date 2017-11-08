import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.userService.isAuthenticated()) {
        let returnPath = '';
        if (next.url && next.url.length > 0) {
          returnPath = next.url.map(x => x.path).join('/');
        }
        this.router.navigate(['login'], { queryParams: { returnPath: returnPath } });
        return false;
      }
      return true;
  }
}
