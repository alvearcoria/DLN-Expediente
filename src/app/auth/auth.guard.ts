import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireAuth } from "@angular/fire/compat/auth";

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

//aimport Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    public router: Router,
    private firebaseAuth: AngularFireAuth

  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.firebaseAuth.authState.take(1).map(authState => !!authState).do(async authenticated => {
      if (authenticated) {
        await this.auth.getUserAccount();
        //console.log(this.auth.currentUserId);
        if (next.data['role']) {
          if (next.data['role'].includes(this.auth.userData.role)) {
            return true
          } else {
            this.router.navigate(['/pages/contenido-bloqueado']);
            return false;
          }
        }
        return true;
      }
      if (!authenticated) {
        this.router.navigate(['/logout']);
        return false;
      }
    });
  }

}
