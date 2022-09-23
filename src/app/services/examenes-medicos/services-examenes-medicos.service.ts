import { Injectable, } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesExamenesMedicosService {

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
  ) { }

  getAllExamenes() {
    return this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
  }

  getAllEmpleados() {
    return this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('empleados', ref => ref.orderBy('idNumerico', 'asc').limit(2) ).valueChanges();
  }

  getExamenMedico(id: string) {
    return this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos').doc(id).valueChanges();
  }

  addExamenMedico(post: any) {
    return new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos').doc('counter').valueChanges().pipe(take(1)).subscribe(data => {
        var idNum = data['counter'] + 1;
        post['f_registro'] = new Date();
        post['user_reg'] = this.auth.currentUserId;
        post['estatus'] = 'creado';
        post['id_examen_medico'] = this.afs.createId();
        post['idNumerico'] = idNum;
        this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos').doc(post['id_examen_medico']).set(post).then(() => {
          this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos').doc('counter').set({ counter: idNum }).then(() => {
            resolve();
          });
        });
      });
    });
  }

  updateExamenMedico(post: any, id: string) {
    post['user_update'] = this.auth.currentUserId;
    post['f_edit'] = new Date();
    post['estatus'] = 'actualizado';
    return new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('examenes_medicos').doc(id).update(post).then(() => {
        resolve()
      })
    })
  }
}
