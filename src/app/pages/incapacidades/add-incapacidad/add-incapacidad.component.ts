import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dln-add-incapacidad',
  templateUrl: './add-incapacidad.component.html',
  styleUrls: ['./add-incapacidad.component.scss']
})
export class AddIncapacidadComponent implements OnInit {

  @Input() currentdetalle_inca: any = null;
  @Input() currentIncapacidad: any = null;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  file: any;
  mssbtn: string = "Guardar";
  dataFrom: FormGroup;
  efirma_atiende: any = '';
  dataQuery: any;
  valueDate: any;
  statusBtn: boolean = true;
  loading: boolean = false;
  datedisabled: string = 'false';
  fTermina_inca: string = '';
  fileURL: any;

  createFG_dataConsulta() {
    return new FormGroup({
      inca_fInicia: new FormControl("", [Validators.required]),
      inca_fRecibe: new FormControl("", [Validators.required]),
      inca_folio: new FormControl("", [Validators.required]),
      inca_tipo: new FormControl("", [Validators.required]),
      inca_riesgo: new FormControl("", [Validators.required]),
      inca_dias: new FormControl("", [Validators.required]),
      inca_diagnostico: new FormControl("", [Validators.required]),
      inca_file: new FormControl("", [Validators.required]),
      inca_file_valid: new FormControl("", [Validators.required]),
    });
  }

  get cons() { return this.dataFrom.controls; }

  constructor(
    public router: Router,
    public route2: ActivatedRoute,
    public datepipe: DatePipe,
    private afs: AngularFirestore,
    public auth: AuthService,
    private storage: AngularFireStorage,
  ) {
    this.dataFrom = this.createFG_dataConsulta();
    this.onChanges();
  }

  async ngOnInit() {

    if (this.currentdetalle_inca != null) {
      this.statusBtn = false;
      this.dataFrom.patchValue({
        inca_fInicia: new Date(this.currentdetalle_inca.inca_fInicia.seconds * 1000),
        inca_fRecibe: new Date(this.currentdetalle_inca.inca_fRecibe.seconds * 1000),
        inca_folio: this.currentdetalle_inca.inca_folio,
        inca_tipo: this.currentdetalle_inca.inca_tipo,
        inca_riesgo: this.currentdetalle_inca.inca_riesgo,
        inca_dias: this.currentdetalle_inca.inca_dias,
        inca_diagnostico: this.currentdetalle_inca.inca_diagnostico,
      });
      await this.storage.ref(this.currentdetalle_inca.urlfile).getDownloadURL().subscribe((URL) => {
        this.fileURL = URL;
      });

      this.dataFrom.disable({ onlySelf: true });

    }
    else {
      if (this.currentIncapacidad == null) {
        //this.mssbtn = "Guardar";
        this.datedisabled = 'false';
      } else {

        if (new Date(this.currentIncapacidad["f_termina"].seconds * 1000) < new Date()) {
          var ftemp = new Date(this.currentIncapacidad["f_termina"].seconds * 1000);
          this.valueDate = new Date(ftemp.setDate(ftemp.getDate() + 1));
          this.dataFrom.patchValue({ inca_fInicia: this.valueDate, });
          this.datedisabled = 'true';

        } else {
          Swal.fire(
            'ATENCION!',
            'No puedes añadir una nueva incapaciada, la fecha de termino aun es mayor a la de el dia de hoy...',
            'error',
          ).then(() => {
            this.closeModal.emit({ cerrar: true });
            this.dataFrom.reset();
          });
        }
      }
    }

    /* else{
    console.log('If else');
      this.route2.queryParams.subscribe(async params => {
        //this.dataEmpleado = params;
        if (!params.id_incapacidad) {
          console.log('Nuevo registro');
          if (!params.id_consulta) { this.idConsulta = ''; } else { this.idConsulta = params.id_consulta; }
          this.mssbtn = "Guardar";
        } else {
          console.log('Actualizar registro');
          this.mssbtn = "Actualizar";
          await this.cargarIncapacidad(params.id_incapacidad);
        }
      });
    } */
  }

  onChanges(): void {
    this.dataFrom.get("inca_fInicia").valueChanges.subscribe((val) => {
      if (val != '') {
        this.dataFrom.get("inca_dias").valueChanges.subscribe((val2) => {
          if (val2 != '') {
            var ftemp = new Date(val);
            var dias = val2 - 1;
            var date = new Date(ftemp.setDate(ftemp.getDate() + dias));
            this.fTermina_inca = this.datepipe.transform(date, 'dd/MM/yyyy');
          }
        });
      }
    });
  }

  async cargarIncapacidad(id_incapacidad) {
    await new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('incapacidades', ref => ref.
        where('id_incapacidad', '==', id_incapacidad)).valueChanges().subscribe(cons => {
          this.dataQuery = cons[0];
          resolve();
        });
    }).then(() => {
      this.dataFrom.patchValue({
        inca_fInicia: new Date(this.dataQuery.inca_fInicia.seconds * 1000),
        inca_fRecibe: new Date(this.dataQuery.inca_fRecibe.seconds * 1000),
        inca_folio: this.dataQuery.inca_folio,
        inca_tipo: this.dataQuery.inca_tipo,
        inca_riesgo: this.dataQuery.inca_riesgo,
        inca_dias: this.dataQuery.inca_dias,
        inca_diagnostico: this.dataQuery.inca_diagnostico,
      });
    });
  }

  upfile(event) {
    if (event.target.files.length > 0) {
      const f = event.target.files[0];
      this.file = f;
      this.dataFrom.controls['inca_file_valid'].setValue('Nuevo Archivo');
    }
  }

  async onUpload(DATA_URL, id_incapacidad) {
    console.log('onUpload');
    console.log(DATA_URL);
    console.log(id_incapacidad);
    console.log(this.currentIncapacidad.detalleEmpleado.id_empleado);
    let filePath = '';
    filePath = this.auth.dataEmp.basedatos + '/' + this.currentIncapacidad.detalleEmpleado.id_empleado + '/incapacidad/' + id_incapacidad + '/incapacidad_pdf.pdf';
    await this.storage.upload(filePath, DATA_URL).then(() => {
      console.log('Archivo subido');
    });
    return filePath;
  }

  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      this.updatequery();
    } else {
      this.savequery();
    }
  }

  async savequery() {
    console.log('Guardar');
    console.log(this.currentIncapacidad);
    this.statusBtn = false;
    this.loading = true;
    var data_incapacidad = {};
    var tempData = this.dataFrom.value;
    var inca_detalle = this.dataFrom.value;
    const incapacidad_id = this.afs.createId();
    const ref2 = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('incapacidades');
    if (this.currentIncapacidad == null) {
      console.log('Nuevo registro');

      data_incapacidad['id_incapacidad'] = incapacidad_id;
      data_incapacidad['total_incapacidades'] = 1;
      data_incapacidad['id_consulta'] = this.currentIncapacidad.id;
      data_incapacidad['dias_totales'] = tempData.inca_dias;
      data_incapacidad['f_inicio'] = inca_detalle.inca_fInicia;
      var dias = tempData.inca_dias - 1;
      var ftemp = new Date(inca_detalle.inca_fInicia);
      var ftermina = new Date(ftemp.setDate(ftemp.getDate() + dias));
      data_incapacidad['f_ingreso_lab'] = ftermina;
      data_incapacidad['f_ingreso_lab_real'] = '';
      data_incapacidad['estatus_inca'] = 'activa';
      data_incapacidad['tipo_incapacidad'] = inca_detalle.inca_tipo;
      data_incapacidad['observacion_general'] = '';
      data_incapacidad['f_termina'] = ftermina;
      data_incapacidad['f_termina_real'] = '';
      data_incapacidad['f_registro'] = new Date();
      data_incapacidad['user_reg'] = this.auth.currentUserId;
      data_incapacidad['estatus'] = 'creado';
      /* data_incapacidad['detalleEmpleado'] = {
        id_empleado: this.currentEmpleado.id,
        fullname: this.currentEmpleado.fullname,
        pac_curp: this.currentEmpleado.pac_curp,
        pac_imss: this.currentEmpleado.pac_imss,
        pac_nomina: this.currentEmpleado.pac_nomina,
      } */
      await ref2.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
        const idNum = Number(c["counter"]) + 1;
        data_incapacidad["idNumerico"] = idNum;
        await ref2.doc("counter").set({ counter: idNum }).then(async () => {
          await ref2.doc(incapacidad_id).set(data_incapacidad).then(() => {
          });
        });
      });
    } else {

      console.log('Actualizar registro');

      data_incapacidad['total_incapacidades'] = this.currentIncapacidad['total_incapacidades']++;
      data_incapacidad['dias_totales'] = tempData.inca_dias + this.currentIncapacidad['dias_totales'];
      var fTemporal = new Date(this.currentIncapacidad['f_inicio'].seconds * 1000);
      var dias = data_incapacidad['dias_totales'] - 1;
      var ftermina = new Date(fTemporal.setDate(fTemporal.getDate() + dias));
      data_incapacidad['f_ingreso_lab'] = ftermina;
      data_incapacidad['estatus_inca'] = 'activa';
      data_incapacidad['f_termina'] = ftermina;
      await ref2.doc(this.currentIncapacidad['id_incapacidad']).update(data_incapacidad).then(() => {
        console.log('Actualizado incapacidad general');
      });
    }

    const detalle_incapacidad_id = this.afs.createId();
    if (this.currentIncapacidad == null) { inca_detalle['id_incapacidad'] = incapacidad_id; }
    else { inca_detalle['id_incapacidad'] = this.currentIncapacidad['id_incapacidad']; }
    inca_detalle['id_detalle_incapacidad'] = detalle_incapacidad_id;
    var ftemp = new Date(inca_detalle.inca_fInicia);
    inca_detalle['inca_fTermina'] = new Date(ftemp.setDate(ftemp.getDate() + (inca_detalle.inca_dias - 1)));
    inca_detalle['user_reg'] = this.auth.currentUserId;
    inca_detalle['f_registro'] = new Date();
    inca_detalle['estatus'] = 'creado';

    inca_detalle['urlfile'] = await this.onUpload(this.file, detalle_incapacidad_id);

    //if (this.currentIncapacidad.id != '') { inca_detalle['id_consulta'] = this.currentIncapacidad.id; }

    inca_detalle['id_consulta'] = this.currentIncapacidad.id_consulta;

    delete inca_detalle['inca_file'];
    delete inca_detalle['inca_file_valid'];


    console.log(inca_detalle);

    const ref = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('detalles_incapacidad');

    await ref.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
      const idNum = Number(c["counter"]) + 1;
      inca_detalle["idNumerico"] = idNum;
      await ref.doc("counter").set({ counter: idNum }).then(async () => {
        console.log('Actualizado counter');
        await ref.doc(detalle_incapacidad_id).set(inca_detalle).then(() => {
          Swal.fire(
            '¡Datos Guardados!',
            'Los datos ha sido guardado correctamente',
            'success',
          ).then(() => {
            this.closeModal.emit({ cerrar: true });
            this.dataFrom.reset();
            this.loading = false;
          });
        });
      });
    });
  }


  async updatequery() {

    var post = this.dataFrom.value;
    post['user_update'] = this.auth.currentUserId;
    post['f_edit'] = new Date();
    post['estatus'] = 'actualizado';
    var ftemp = new Date(post.inca_fInicia);
    post['inca_fTermina'] = new Date(ftemp.setDate(ftemp.getDate() + post.inca_dias));

    /*
    post['id_consulta'] = this.dataQuery.id_consulta;

    if (this.dataFrom.value.subir_evi == 'si') {
      if (this.dataFrom.value.inca_file_valid == 'Archivo Actual') {
        post['urlfile'] = this.dataQuery.urlfile;
      }
      else {
        post['urlfile'] = await this.onUpload(this.file, this.dataQuery.id_consulta, 'file_evi');
      }
    } else {
      post['urlfile'] = this.dataQuery.urlfile;
    }

    //post['urlPDF'] = await this.pdfservice.generarPDFConsulta(this.auth.dataEmp.basedatos, this.dataEmpleado, post);

    delete post['file'];
    delete post['inca_file_valid'];
    delete post['id_consulta'];
/*
    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas').doc(this.dataQuery.id_consulta).update(post).then(() => {
      Swal.fire(
        '¡Datos Actualizado!',
        'Los datos ha sido actualizados correctamente',
        'success',
      ).then(() => {
        this.redirect();
      });
    });
*/
  }

}
