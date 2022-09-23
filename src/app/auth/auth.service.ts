import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any = null; // Save logged in user data
  dataEmp: any = null;
  user: any = null;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {

    console.log('Constructor de Auth');
    this.afAuth.onAuthStateChanged(user => {
      console.log('Obtener user');
      if (user) {
        console.log('User Login. >>>', user);
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        JSON.parse(localStorage.getItem('user'));
        //this.getUserAccount();

      } else {
        console.log('User Login OUT. >>>', user)
        this.user = null;
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
      console.log('Fin de obtener. >>>')
    });
    console.log('Constructor de Auth ----- FIN');
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
                          //await this.getUserAccount(num_cuenta);
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
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  async getUserAccount() {
    await new Promise(resolve => {
      let currentaccount = 0
      currentaccount = Number(localStorage.getItem('account'));

      this.afs.collection('sistema').doc('configuracion').collection('cuentas', ref =>
        ref.where('cuenta', '==', currentaccount)).valueChanges().pipe(take(1)).subscribe(
          x => {
            this.dataEmp = x[0];
            if (x.length != 0) {
              this.afs.collection(this.dataEmp['raiz']).doc(this.dataEmp['basedatos']).collection('usuarios')
                .doc(this.currentUserId).valueChanges().pipe(take(1)).subscribe(
                  x => {
                    this.userData = x;
                    resolve(x);
                  });
            } else {
              this.SignOut();
            }
          });
    }).then(() => {

    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.setItem('user', null);
      JSON.parse(localStorage.getItem('user'));
      this.userData = null;
      this.user = null;
      this.router.navigate(['login']);
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get currentUserId(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.isLoggedIn ? user.uid : '';
  }
}
