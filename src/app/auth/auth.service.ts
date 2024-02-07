import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { User } from 'firebase/auth';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User = null;
  userData: any = null;
  dataEmp: any = null;

  constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore,) {
    this.afAuth.authState.subscribe(async user => {
      if (user != null) {
        //console.log('llamando getUserAccount - Constructor');
        //await this.getUserAccount();
        this.user = user;
        //this.router.navigate(['/pages']);
      } else {

      }
    });
  }

  SignIn(num_cuenta: number, email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('sistema').doc('configuracion').collection('cuentas', ref =>
        ref.where('cuenta', '==', num_cuenta)).valueChanges().pipe(take(1)).subscribe(
          x => {
            this.dataEmp = x[0];
            if (x.length != 0) {
              this.afs.collection(this.dataEmp.raiz).doc(this.dataEmp.basedatos).collection('usuarios', ref =>
                ref.where('email', '==', email)).valueChanges().pipe(take(1)).subscribe(
                  user => {
                    if (user.length != 0) {
                      this.afAuth.signInWithEmailAndPassword(email, password)
                        .then(async res => {
                          localStorage.setItem('account', num_cuenta.toString());
                          await this.getUserAccount(num_cuenta);
                          resolve(res);
                        }, err => reject(err));
                    } else {
                      reject('errEmpUser');
                    }
                  });
            } else {
              reject('errCuenta');
            }
          });
    })
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.userData = null;
      this.router.navigate(['login']);
    });
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get currentUserId(): string {
    return this.isLoggedIn ? this.user.uid : '';
  }

  async getUserAccount(num_cuenta?: number) {
    await new Promise<void>(resolve => {
      let currentaccount = 0
      if (num_cuenta) currentaccount = num_cuenta;
      else {
        currentaccount = Number(localStorage.getItem('account'));
      }
      this.afs.collection('sistema').doc('configuracion').collection('cuentas', ref =>
        ref.where('cuenta', '==', currentaccount)).valueChanges().subscribe(
          x => {
            this.dataEmp = x[0];
            //localStorage.setItem('raiz', this.dataEmp['raiz'].toString());
            //localStorage.setItem('basedatos',this.dataEmp['basedatos'].toString());
            //console.log(x);
            //console.log(x[0]);
            if (x.length != 0) {
              //console.log('existe la cuenta...');
              this.afs.collection(this.dataEmp['raiz']).doc(this.dataEmp['basedatos']).collection('usuarios').doc(this.user.uid).valueChanges().subscribe(
                x => {
                  this.userData = x;
                  resolve();
                });
            } else {
              //console.log('NO existe la cuenta...')
              this.SignOut();
            }
          });
    }).then(() => {

    });
  }

}
