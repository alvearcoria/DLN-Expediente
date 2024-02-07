import { Component, OnChanges, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dln-addsubempresa',
  templateUrl: './addsubempresa.component.html',
  styleUrls: ['./addsubempresa.component.scss']
})
export class AddsubempresaComponent implements OnInit {

  subempForm: FormGroup;
  mssbtn: string;
  encabezado: any;
  dataQuery: any;
  loading: boolean = false;
  array_areas = [];
  messageError: any;

  constructor(
    public route2: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    private afs: AngularFirestore,
    public fb: FormBuilder,
  ) {
    this.subempForm = this.fb.group({
      nombre: new FormControl("", [Validators.required]),
      areas: new FormArray([]),
    });
  }

  get sEmp() { return this.subempForm.controls; }
  get areasFC() { return this.sEmp.areas as FormArray; }

  ngOnInit() {

    this.route2.queryParams.subscribe(async params => {
      if (!params.id_subemp) {
        this.encabezado = "Nuevo Registro";
        this.mssbtn = "Guardar";
        this.areasFC.push(this.addArea());

      } else {
        this.encabezado = "Actualizar registro";
        this.mssbtn = "Actualizar";
        await this.cargarConsulta(params.id_subemp);
      }
    });

    //this.ngOnChanges();
  }

  /* ngOnChanges() {

  } */

  async cargarConsulta(id_subemp) {

    await new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('subempresas', ref => ref.
        where('id', '==', id_subemp)).valueChanges().subscribe(cons => {
          this.dataQuery = cons[0];
          resolve();
        });
    }).then(() => {

      this.subempForm.patchValue({
        nombre: this.dataQuery.nombre,
      });

      this.dataQuery.areas.map(p => {
        this.areasFC.push(this.fb.group({ name_area: [p, Validators.required,] }))
      });

    });
  }

  addArea() {
    return this.fb.group({
      name_area: ['', Validators.required],
    });
  }



  validname_area(i) {
    let count = 0;
    if (this.areasFC.value) {
      for (let prueba of this.areasFC.value) {
        if (this.areasFC.at(i).value.name_area == prueba.name_area)
          count++;
      }
    }

    if (count > 1) {
      this.messageError = 'Nombre de area repetido...';
      return false;
    }
    else {
      this.messageError = '';
      return true;
    }
  }

  redirect() {
    this.router.navigate(['/pages/subempresas'],
      { queryParams: {}, skipLocationChange: true });
  }

  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      this.updatesubemp();
    } else {
      this.savesubemp();
    }
  }

  async savesubemp() {
    var a = [];
    var post = this.subempForm.value;
    const id = this.afs.createId();
    post['id'] = id;
    post['user_reg'] = this.auth.currentUserId;
    post['f_registro'] = new Date();
    post['estatus'] = 'creado';

    for (var i = 0; i < post.areas.length; i++) {
      a.push(post.areas[i].name_area)
    }
    post['areas'] = a;

    const ref = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('subempresas');
    ref.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
      const idNum = Number(c["counter"]) + 1;
      post["idNumerico"] = idNum;
      await ref.doc("counter").set({ counter: idNum }).then(async () => {
        await ref.doc(id).set(post).then(() => {
          Swal.fire(
            '¡Datos Guardados!',
            'Los datos ha sido guardado correctamente',
            'success',
          ).then(() => {
            this.redirect();
            this.subempForm.reset();
          });
        });
      });
    });

  }

  async updatesubemp() {
    var a = [];
    var post = this.subempForm.value;
    post['user_update'] = this.auth.currentUserId;
    post['f_edit'] = new Date();
    post['estatus'] = 'actualizado';

    for (var i = 0; i < post.areas.length; i++) {
      a.push(post.areas[i].name_area)
    }
    post['areas'] = a;

    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('subempresas').doc(this.dataQuery.id).update(post).then(() => {
      Swal.fire(
        '¡Datos Actualizado!',
        'Los datos ha sido actualizados correctamente',
        'success',
      ).then(() => {
        this.redirect();
        this.subempForm.reset();
      });
    });

  }

}
