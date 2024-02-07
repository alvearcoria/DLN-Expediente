import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { NgxImageCompressService } from 'ngx-image-compress';
const Swal = require('sweetalert2');


@Component({
  selector: 'dln-checkup',
  templateUrl: './checkup.component.html',
  styleUrls: ['./checkup.component.scss']
})
export class CheckupComponent implements OnInit {

  RegistroForm: FormGroup;
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

enfermedades: string[] = [
    'Ninguna',
    'Neurológica',
    'Gastrovascular',
    'Respiratorio',
    'Endocrino',
    'Digestivo',
    'Genitourinario',
    'Dermatoesqueleto',
    'Dermatológico',
    'Otras'
  ];

  constructor(
    public router: Router,
    public route2: ActivatedRoute,
    private auth: AuthService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService,
  ) {
    this.RegistroForm = this.createRegistroForm();
  }

  async ngOnInit() {
    this.loading = true;
    await new Promise<void>((resolve) => {
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
          //await this.obtenerpase(params);
          this.loading = false;
        }
      });


      this.done = true;
    }).then(async () => {

    }).catch((error) => {
      console.log(error);
    })
  }

  createRegistroForm() {
    return new FormGroup({

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
      //pac_cp: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern('[0-9]{5}')]),

      pac_edad: new FormControl('', [Validators.required]),
      pac_empresa: new FormControl('', [Validators.required]),
      pac_puesto: new FormControl('', [Validators.required]),

      fuma: new FormControl(false),
      cantidadFumasSemana: new FormControl(''),
      cantidadFumasDia: new FormControl(''),
      bebeAlcohol: new FormControl(false),
      cantidadAlcoholDia: new FormControl(''),
      diasAlcoholSemana: new FormControl(''),

      enfermedades: this.buildEnfermedadesGroup(),
      otrasEnfermedades: new FormControl(''),
      horasSueno: new FormControl(''),
      descansaBien: new FormControl(''),
      satisfechoPareja: new FormControl('')


    },
    );
  }

  private buildEnfermedadesGroup() {
    const group: { [key: string]: FormControl } = {};
    this.enfermedades.forEach(enfermedad => {
      group[enfermedad] = new FormControl(false);
    });
    return new FormGroup(group);
  }

  get pacf() { return this.RegistroForm.controls; }

  onCancel() {
    this.router.navigate(['/pages/empleados']);
  }

  calcularEdad(): void {
    const fechaNacimiento: Date = new Date(this.RegistroForm.value.pac_fNacimiento);

    if (!isNaN(fechaNacimiento.getTime())) {
      const edad: number = this.calcularEdadDesdeFecha(fechaNacimiento);
      console.log('Edad calculada:', edad);
      this.RegistroForm.patchValue({ pac_edad: edad });
    }
  }

  private calcularEdadDesdeFecha(fechaNacimiento: Date): number {
    const hoy: Date = new Date();
    let edad: number = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual: number = hoy.getMonth() + 1;
    const mesNacimiento: number = fechaNacimiento.getMonth() + 1;

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad;
  }
  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      //this.updateEmpleado();
    } else {
      //this.guardarPaciente();
    }
  }

  onKeydown(event) {
    const campo = event.srcElement.attributes.formcontrolname.nodeValue;
    let value: string = this.RegistroForm.controls[campo].value;
    value = value.toUpperCase();
    this.RegistroForm.controls[campo].setValue(value);

    if (campo == 'pac_curp' && value.length >= 18) {
      //this.validCURP(value);
    }
  }



}
