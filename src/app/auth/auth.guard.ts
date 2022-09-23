import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

//aimport Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    public router: Router,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Auth Guard');
    console.log('UserData >>>>', this.auth.userData);
    if (this.auth.isLoggedIn) {
      this.auth.getUserAccount().then(data => {
        if (route.data.cat) {
          let permisosCat = Object.keys(data['permisos']);
          if (permisosCat.includes(route.data.categoria)) return true;
          else this.router.navigate(['403']);
        } else {
          let permisosCat = Object.keys(data['permisos'][route.data.categoria]);
          if (permisosCat.includes(route.data.pagina)) return true;
          else this.router.navigate(['403']);
        }
      })
      return true;
    }
    /*Swal.fire({
      title: 'Error!',
      text: 'No tienes permisos para ver esta página',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(()=>{*/

    this.router.navigate(['/logout']);
    return false;
    // })
  }

}
