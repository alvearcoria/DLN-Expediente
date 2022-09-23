import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { NgxImageCompressService } from 'ngx-image-compress';


const Swal = require('sweetalert2');

@Component({
  selector: 'dln-addempleado',
  templateUrl: './addempleado.component.html',
  styleUrls: ['./addempleado.component.scss']
})
export class AddempleadoComponent implements OnInit {

  pacienteForm: FormGroup;
  valueNombre: string = '^([A-ZÀ-ÿ]{2,20})*( [A-ZÀ-ÿ]{2,20}){0,3}$';
  valueCURP: string = '[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}';
  CURPValid: boolean = false;

  encabezado = "";
  mssbtn = "";
  imagepath: any = "assets/images/avatardefault.jpg";
  filePath: any;
  localUrl: any;

  dataAreas = [];
  dataEmpresas = [];
  dataEmpleado: any = '';

  done: boolean = false;
  loading: boolean = false;
  estatus: boolean = false;

  localCompressedURl: any;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  imageResult: any;


  constructor(
    public router: Router,
    public route2: ActivatedRoute,
    private auth: AuthService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService,

  ) {
    this.pacienteForm = this.createPacienteForm();
  }

  async ngOnInit() {
    this.loading = true;
    await new Promise<void>((resolve) => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos)
        .collection('subempresas', ref => ref.orderBy('idNumerico', 'asc')).valueChanges().subscribe((allSubempresas) => {

          if (allSubempresas.length > 0) {
            for (let subemp of allSubempresas) {
              this.dataEmpresas.push(subemp);
            }
            resolve();
          } else {
            Swal.fire({
              title: 'No tienes subempresas registradas.',
              // tslint:disable-next-line: max-line-length
              text: 'Para poder registrar un usuario favor de agregar al menos una subempresa con sus respectivas áreas. ¿Deseas agregar una subempresa ahora?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, crear subempresa.',
              cancelButtonText: 'No, regresar.'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/pages/subempresas']);
              } else {
                this.router.navigate(['/pages/empleados']);
              }
            });
            resolve();
          }
        });
    }).then(async () => {
      this.route2.queryParams.subscribe(async (params) => {
        if (!params.id) {
          this.loading = false;
          this.estatus = false;
          this.encabezado = "Registrar nuevo empleado";
          this.mssbtn = "Guardar";
        } else {
          this.dataEmpleado = params;
          this.encabezado = "Actualizar datos del empleado";
          this.mssbtn = "Actualizar";
          this.estatus = false;
          let arraryArea = this.dataEmpresas.find(element => element.id == this.dataEmpleado.subempresa);
          this.dataAreas = arraryArea.areas;
          await this.obtenerpase(params);
          this.loading = false;
        }
      });

      this.pacienteForm.get("subempresa").valueChanges.subscribe((val) => {
        if (val != this.dataEmpleado.subempresa) {
          this.pacienteForm.patchValue({ area: '' });
          this.pacienteForm.patchValue({ ori_pac_name: this.dataEmpresas.filter((c) => c.id == val)[0]["nombre"] });
          let arraryArea = this.dataEmpresas.find(element => element.id == val);
          this.dataAreas = arraryArea.areas;
        }
      });
      this.done = true;
    }).catch((error) => {
      console.log(error);
    })
  }

  createPacienteForm() {
    return new FormGroup({
      area: new FormControl('', [Validators.required]),
      subempresa: new FormControl('', [Validators.required]),
      ori_pac_name: new FormControl('', [Validators.required]),

      pac_curp: new FormControl('', [Validators.required, Validators.pattern(this.valueCURP)]),
      pac_rfc: new FormControl(''),
      pac_imss: new FormControl('', [Validators.required]),
      pac_nomina: new FormControl('', [Validators.required]),

      pac_nombres: new FormControl('', [Validators.required, Validators.pattern(this.valueNombre)]),
      pac_apPrimero: new FormControl('', [Validators.required, Validators.pattern(this.valueNombre)]),
      pac_apSegundo: new FormControl('', [Validators.required, Validators.pattern(this.valueNombre)]),

      pac_fNacimiento: new FormControl('', [Validators.required]),
      pac_email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]),
      pac_tel: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),

      pac_estado_civil: new FormControl('', [Validators.required]),
      pac_escolaridad: new FormControl('', [Validators.required]),

      pac_tipo_sangre: new FormControl('', [Validators.required]),
      pac_genero: new FormControl('', [Validators.required]),

      pac_dir_calle: new FormControl('', [Validators.required]),
      pac_dir_col: new FormControl('', [Validators.required]),
      pac_ciudad: new FormControl('', [Validators.required]),
      pac_estado: new FormControl('', [Validators.required]),
      pac_cp: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern('[0-9]{5}')]),

      Image: new FormControl(''),
      //firma: new FormControl ('', [Validators.required]),   //decía sin firma, ahora requiere validación
    },
    );
  }

  get pacf() { return this.pacienteForm.controls; }

  OnChanges() {
    this.pacienteForm.get("subempresa").valueChanges.subscribe((val) => {
      let arraryArea = this.dataEmpresas.find(element => element.id == val);
      this.dataAreas = arraryArea.areas;
    });
  }

  onCancel() {
    this.router.navigate(['/pages/empleados']);
  }

  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      this.updateEmpleado();
    } else {
      this.guardarPaciente();
    }
  }

  async obtenerpase(data) {
    if (data.Image != '') {
      const filePath = data.Image;
      this.storage.ref(filePath).getDownloadURL().subscribe((URL) => {
        this.imagepath = URL;
      });
    }

    return new Promise<void>((resolve) => {
      this.pacienteForm.patchValue(data);
      resolve();
    });
  }

  onKeydown(event) {
    const campo = event.srcElement.attributes.formcontrolname.nodeValue;
    let value: string = this.pacienteForm.controls[campo].value;
    value = value.toUpperCase();
    this.pacienteForm.controls[campo].setValue(value);

    if (campo == 'pac_curp' && value.length >= 18) {
      this.validCURP(value);
    }
  }

  validCURP(curp: string) {
    console.log('Validar CURP Existe --->>>>', curp);
    return false;
  }

  onUpload(DATA_URL) {
    const namephoto: string = this.pacienteForm.controls['pac_curp'].value;//+'.jpg';
    this.filePath = 'Empresa/' + this.auth.dataEmp.basedatos + '/empleados_' + namephoto + '/photo.jpg';
    const ref = this.storage.ref(this.filePath);
    const task = ref.putString(DATA_URL, 'data_url');
    return this.filePath;
  }

  previewFile(event) {
    new Promise<void>((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = async (event: any) => {
        this.imagepath = reader.result;
        //console.log(this.imagepath);
        this.localUrl = event.target.result;
        await this.compressFile(this.localUrl, "fotoempleado");
        resolve();
      }
      // console.log("after press");
      reader.readAsDataURL(event.target.files[0]);

      //this.imagepath = reader.result;
    });
  }

  async compressFile(image, fileName) {
    return new Promise<void>(resolve => {
      var orientation = -1;
      this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
      this.imageCompress.compressFile(image, orientation, 30, 30).then(
        result => {
          this.imgResultAfterCompress = result;
          this.localCompressedURl = result;
          this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024)
          this.imagepath = this.imgResultAfterCompress;
          this.pacienteForm.get('Image').setValue("imagen_new");
          resolve();
        }
      );
    });
  }

  async guardarPaciente() {
    console.log('Guardar nuevo Empleado');

    const post = this.pacienteForm.value;
    const id = this.afs.createId();
    post['id'] = id;
    post['user_reg'] = this.auth.currentUserId;
    post['f_registro'] = new Date();
    post['f_edit'] = new Date();

    if (this.pacienteForm.get('Image').value == 'imagen_new') {
      post['Image'] = this.onUpload(this.imagepath);
    } else if (this.imagepath == "assets/images/avatardefault.jpg") {
      post['Image'] = "";
    } else {
      post['Image'] = "";
    }
    const ref = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection("empleados");

    await ref.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
      const idNum = Number(c["counter"]) + 1;
      post["idNumerico"] = idNum;
      await ref.doc("counter").set({ counter: idNum }).then(async () => {
        await ref.doc(id).set(post).then(async () => {
          Swal.fire(
            'Registro de Empleado',
            'El empleado ha sido almacenado correctamente!',
            'success',
          );
          this.onCancel();
          this.pacienteForm.reset();
        });
      });
    });
  }

  async updateEmpleado() {
    const post = this.pacienteForm.value;
    post['f_edit'] = new Date();
    post['user_edit'] = this.auth.currentUserId;

    if (this.imagepath == "assets/images/avatardefault.jpg") {
      post['Image'] = "";
    } else if (this.pacienteForm.get('Image').value == 'imagen_new') {
      post['Image'] = this.onUpload(this.imagepath);
    } else {
      post['Image'] = this.dataEmpleado.Image;
    }

    await this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('empleados')
      .doc(this.dataEmpleado.id).update(post).then(() => {
        Swal.fire(
          'Editar Paciente',
          'El empleado ha sido editado correctamente!',
          'success',
        );
        this.onCancel();
        this.pacienteForm.reset();
      });
  }
}
