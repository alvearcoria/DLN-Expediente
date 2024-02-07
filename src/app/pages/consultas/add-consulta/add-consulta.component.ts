
import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormArray, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { PdfservicesService } from './../../../services/generatePDF/pdfservices.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NbDateService, } from '@nebular/theme';
//import { ModaldetalleComponent } from '../modaldetalle/modaldetalle.component';

@Component({
  selector: 'dln-add-consulta',
  templateUrl: './add-consulta.component.html',
  styleUrls: ['./add-consulta.component.scss']
})
export class AddConsultaComponent implements OnInit {

  selected = [];
  loading: boolean = false;
  inputselect: string = "Servicio Medico";

  dataEmpleado: any;
  dataQuery: any;
  datosGeneralesFrom: FormGroup;
  dataFrom: FormGroup;
  mssbtn: string;
  tieneInca: boolean = false;

  listPartesCuerpo = [
    { id: 1, parte_cuerpo: '1 DEDO MANO DERECHA' },
    { id: 2, parte_cuerpo: '1 DEDO MANO IZQUIERDA' },
    { id: 3, parte_cuerpo: '2 DEDO MANO DERECHA' },
    { id: 4, parte_cuerpo: '2 DEDO MANO IZQUIERDA' },
    { id: 5, parte_cuerpo: '3 DEDO MANO DERECHA' },
    { id: 6, parte_cuerpo: '3 DEDO MANO IZQUIERDA' },
    { id: 7, parte_cuerpo: '4 DEDO MANO DERECHA' },
    { id: 8, parte_cuerpo: '4 DEDO MANO IZQUIERDA' },
    { id: 9, parte_cuerpo: '5 DEDO MANO DERECHA' },
    { id: 10, parte_cuerpo: '5 DEDO MANO IZQUIERDA' },
    { id: 11, parte_cuerpo: 'ABDOMEN' },
    { id: 12, parte_cuerpo: 'ANTEBRAZO DERECHO' },
    { id: 13, parte_cuerpo: 'ANTEBRAZO IZQUIERDO' },
    { id: 14, parte_cuerpo: 'BRAZO DERECHO' },
    { id: 15, parte_cuerpo: 'BRAZO IZQUIERDO' },
    { id: 16, parte_cuerpo: 'CARA' },
    { id: 17, parte_cuerpo: 'CABEZA' },
    { id: 18, parte_cuerpo: 'CADERA' },
    { id: 19, parte_cuerpo: 'CODO DERECHO' },
    { id: 20, parte_cuerpo: 'CODO IZQUIERDO' },
    { id: 21, parte_cuerpo: 'CUELLO' },
    { id: 22, parte_cuerpo: 'ESPALDA' },
    { id: 23, parte_cuerpo: 'HOMBRO DERECHO' },
    { id: 24, parte_cuerpo: 'HOMBRO IZQUIERDO' },
    { id: 25, parte_cuerpo: 'MANO DERECHA' },
    { id: 26, parte_cuerpo: 'MANO IZQUIERDA' },
    { id: 27, parte_cuerpo: 'MUÑECA DERECHA' },
    { id: 28, parte_cuerpo: 'MUÑECA IZQUIERDA' },
    { id: 29, parte_cuerpo: 'MUSLO DERECHO' },
    { id: 30, parte_cuerpo: 'MUSLO IZQUIERDO' },
    { id: 31, parte_cuerpo: 'OJO IZQUIERDO' },
    { id: 32, parte_cuerpo: 'OJO DERECHO' },
    { id: 33, parte_cuerpo: 'ORGANOS INTERNOS' },
    { id: 34, parte_cuerpo: 'OTROS' },
    { id: 35, parte_cuerpo: 'PIE DERECHO' },
    { id: 36, parte_cuerpo: 'PIE IZQUIERDO' },
    { id: 37, parte_cuerpo: 'PIERNA DERECHA' },
    { id: 38, parte_cuerpo: 'PIERNA IZQUIERDA' },
    { id: 39, parte_cuerpo: 'REGION LUMBAR' },
    { id: 40, parte_cuerpo: 'RODILLA DERECHA' },
    { id: 41, parte_cuerpo: 'RODILLA IZQUIERDA' },
    { id: 42, parte_cuerpo: 'TOBILLO DERECHO' },
    { id: 43, parte_cuerpo: 'TOBILLO IZQUIERDO' },
    { id: 44, parte_cuerpo: 'TORAX' },
  ];

  file: any;
  fileURL: any = '';
  efirma_atiende: any = '';
  efirma_paciente: any = '';

  typefirma: any;

  min: Date;
  max: Date;

  @ViewChild('efirmamodal', { static: false }) public efirma: ElementRef;
  modalRef: BsModalRef;
  modalRefEvi: BsModalRef;

  configModal = {
    keyboard: false,
    scrollable: false,
    backdrop: true,
    ignoreBackdropClick: true,
    animated: true,
  };

  constructor(public router: Router,
    public route2: ActivatedRoute,
    public datepipe: DatePipe,
    private afs: AngularFirestore,
    public auth: AuthService,
    private storage: AngularFireStorage,
    private pdfservice: PdfservicesService,
    private modalService: BsModalService,
    protected dateService: NbDateService<Date>,
  ) {
    this.min = this.dateService.addMonth(this.dateService.today(), -2);
    this.max = this.dateService.today();
    this.datosGeneralesFrom = this.createFormGrup_dataGeneral();
    this.dataFrom = this.createFG_dataConsulta();
    this.onChanges();
  }

  createFormGrup_dataGeneral() {
    return new FormGroup({
      area: new FormControl(""),
      ori_pac_name: new FormControl(""),
      pac_apPrimero: new FormControl(""),
      pac_apSegundo: new FormControl(""),
      pac_ciudad: new FormControl(""),
      pac_cp: new FormControl(""),
      pac_curp: new FormControl(""),
      pac_dir_calle: new FormControl(""),
      pac_dir_col: new FormControl(""),
      pac_email: new FormControl(""),
      pac_escolaridad: new FormControl(""),
      pac_estado: new FormControl(""),
      pac_estado_civil: new FormControl(""),
      pac_fNacimiento: new FormControl(""),
      pac_edad: new FormControl(""),
      pac_nomina: new FormControl(""),
      pac_imss: new FormControl(""),
      pac_nombres: new FormControl(""),
      pac_sexo: new FormControl(""),
      pac_tel: new FormControl(""),
      pac_tipo_sangre: new FormControl(""),
      subempresa: new FormControl(""),
    });
  }

  get fg() { return this.datosGeneralesFrom.controls; }

  createFG_dataConsulta() {
    const parte_cuerpo = this.listPartesCuerpo.map((control) => new FormControl(false));

    return new FormGroup({
      consu_fecha: new FormControl("", [Validators.required]),
      consu_turno: new FormControl("", [Validators.required]),
      consu_tipo: new FormControl("", [Validators.required]),
      tipo_urge: new FormControl("", [Validators.required]),

      pre_arterial: new FormControl(""),
      frec_cardiaca: new FormControl(""),
      frec_respi: new FormControl(""),
      temperatura: new FormControl(""),


      accidente_faccidente: new FormControl("", [Validators.required]),
      accidente_facude: new FormControl("", [Validators.required]),
      accidente_atendio: new FormControl("Servicio Medico", [Validators.required]),
      accidente_tiporiesgo: new FormControl("", [Validators.required]),
      accidente_supervisor: new FormControl("", [Validators.required]),

      //accidente_parteAfectada: new FormArray(parte_cuerpo),
      accidente_parteAfectada: new FormControl([], [Validators.required]),

      accidente_diagnostico: new FormControl("", [Validators.required]),
      accidente_observacion: new FormControl("", [Validators.required]),
      accidente_diag_general: new FormControl("", [Validators.required]),

      descripcion_sintomas: new FormControl("", [Validators.required]),
      diagnostico_clinico: new FormControl("", [Validators.required]),
      receta: new FormControl("", [Validators.required]),
      nombre_atiende: new FormControl("", [Validators.required]),
      //consu_detalle: new FormControl("", [Validators.required]),

      inca_aplica: new FormControl("", [Validators.required]),

      subir_evi: new FormControl("", [Validators.required]),
      valid_evi: new FormControl("", [Validators.required]),
      evi_tipo: new FormControl({ value: "", disabled: true }),
      file: new FormControl({ value: "", disabled: true }),

      se_refiere: new FormControl("", [Validators.required]),

      //firma_atiende: new FormControl("", [Validators.required]),
      //firma_paciente: new FormControl("", [Validators.required]),
    });
  }

  get cons() { return this.dataFrom.controls; }

  async ngOnInit() {
    this.route2.queryParams.subscribe(async params => {
      this.dataEmpleado = params;
      await this.cargardatoscontacto(this.dataEmpleado);
      if (!params.id_consulta) {
        console.log(this.auth);
        console.log(this.auth.userData.displayName)

        this.dataFrom.patchValue({
          nombre_atiende: this.auth.userData.displayName,
        });
        this.mssbtn = "Guardar";
      } else {
        this.mssbtn = "Actualizar";
        await this.cargarConsulta(params.id_consulta);
      }
    });
  }

  modalfirma(typefirma) {
    this.typefirma = typefirma;
    //this.modalRef = this.modalService.show(this.efirma, this.configModal);
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  onChanges(): void {

    /*  this.dataFrom.get("subempresa").valueChanges.subscribe((val) => {
       let arraryArea = this.listPartesCuerpo.find(element => element.id == val);
       this.dataAreas = arraryArea.areas;
     }); */



    this.dataFrom.get("subir_evi").valueChanges.subscribe((val) => {
      if (val == 'no') {

        this.cons.evi_tipo.setValue("");
        this.cons.evi_tipo.disable();
        this.cons.evi_tipo.clearValidators();

        this.cons.file.setValue("");
        this.cons.file.disable();
        this.cons.file.clearValidators();

        this.cons.valid_evi.setValue("");
        this.cons.valid_evi.disable();
        this.cons.valid_evi.clearValidators();

      } else {
        this.cons.evi_tipo.enable();
        this.cons.evi_tipo.setValidators([Validators.required]);
        this.cons.valid_evi.enable();
        this.cons.valid_evi.setValidators([Validators.required]);
      }
    }
    );

    this.dataFrom.get("evi_tipo").valueChanges.subscribe((val) => {

      if (val == 'photo') {
        this.cons.file.disable();
        this.cons.file.clearValidators();
        /* this.cons.valid_evi.setValue("");
        this.cons.valid_evi.disable();
        this.cons.valid_evi.clearValidators();
        this.cons.valid_evi.setValidators([Validators.required]); */
      } else {
        this.cons.file.enable();
        this.cons.file.setValidators([Validators.required]);
        /* this.cons.valid_evi.enable();
        this.cons.valid_evi.setValidators([Validators.required]); */
      }
    }
    );

    this.dataFrom.get("consu_tipo").valueChanges.subscribe((val) => {
      if (val != 'Riesgo de trabajo') {
        this.cons.tipo_urge.setValue("");
        this.cons.tipo_urge.disable();
        this.cons.tipo_urge.clearValidators();

        this.cons.accidente_faccidente.setValue(""); this.cons.accidente_faccidente.disable(); this.cons.accidente_faccidente.clearValidators();
        this.cons.accidente_facude.setValue(""); this.cons.accidente_facude.disable(); this.cons.accidente_facude.clearValidators();
        //this.cons.accidente_atendio.setValue(""); this.cons.accidente_atendio.disable(); this.cons.accidente_atendio.clearValidators();
        this.cons.accidente_tiporiesgo.setValue(""); this.cons.accidente_tiporiesgo.disable(); this.cons.accidente_tiporiesgo.clearValidators();
        this.cons.accidente_supervisor.setValue(""); this.cons.accidente_supervisor.disable(); this.cons.accidente_supervisor.clearValidators();
        this.cons.accidente_parteAfectada.setValue(""); this.cons.accidente_parteAfectada.disable(); this.cons.accidente_parteAfectada.clearValidators();
        this.cons.accidente_diagnostico.setValue(""); this.cons.accidente_diagnostico.disable(); this.cons.accidente_diagnostico.clearValidators();
        this.cons.accidente_observacion.setValue(""); this.cons.accidente_observacion.disable(); this.cons.accidente_observacion.clearValidators();
        this.cons.accidente_diag_general.setValue(""); this.cons.accidente_diag_general.disable(); this.cons.accidente_diag_general.clearValidators();

        this.cons.descripcion_sintomas.setValidators([Validators.required]);
        this.cons.descripcion_sintomas.enable();
        this.cons.descripcion_sintomas.setValue("");
        this.cons.diagnostico_clinico.setValidators([Validators.required]);
        this.cons.diagnostico_clinico.enable();
        this.cons.diagnostico_clinico.setValue("");
        this.cons.receta.setValidators([Validators.required]);
        this.cons.receta.enable();
        this.cons.receta.setValue("");

      } else {
        this.cons.tipo_urge.enable();
        this.cons.tipo_urge.setValidators([Validators.required]);

        this.cons.accidente_faccidente.setValidators([Validators.required]); this.cons.accidente_faccidente.enable();
        this.cons.accidente_facude.setValidators([Validators.required]); this.cons.accidente_facude.enable();
        this.cons.accidente_atendio.setValidators([Validators.required]); this.cons.accidente_atendio.enable(); this.cons.accidente_atendio.setValue("Servicio Medico");
        this.cons.accidente_tiporiesgo.setValidators([Validators.required]); this.cons.accidente_tiporiesgo.enable();
        this.cons.accidente_supervisor.setValidators([Validators.required]); this.cons.accidente_supervisor.enable();
        this.cons.accidente_parteAfectada.setValidators([Validators.required]); this.cons.accidente_parteAfectada.enable();
        this.cons.accidente_diagnostico.setValidators([Validators.required]); this.cons.accidente_diagnostico.enable();
        this.cons.accidente_observacion.setValidators([Validators.required]); this.cons.accidente_observacion.enable();
        this.cons.accidente_diag_general.setValidators([Validators.required]); this.cons.accidente_diag_general.enable();

        this.cons.descripcion_sintomas.disable();
        this.cons.descripcion_sintomas.clearValidators();
        this.cons.descripcion_sintomas.setValue("");

        this.cons.diagnostico_clinico.disable();
        this.cons.diagnostico_clinico.clearValidators();
        this.cons.diagnostico_clinico.setValue("");

        this.cons.receta.disable();
        this.cons.receta.clearValidators();
        this.cons.receta.setValue("");

      }
    }
    );
  }

  async cargardatoscontacto(data) {
    await new Promise<void>(resolve => {
      let edad;
      try {
        const birthday_arr = data.pac_fNacimiento.split("-");
        const birthday_date = new Date(
          Number(birthday_arr[0]),
          Number(birthday_arr[1]) - 1,
          Number(birthday_arr[2])
        );
        const ageDifMs = Date.now() - birthday_date.getTime();
        const ageDate = new Date(ageDifMs);
        edad = Math.abs(ageDate.getUTCFullYear() - 1970);

      } catch { console.log("error obteniendo edad de fnacimiento") }

      this.datosGeneralesFrom.patchValue({
        area: data.area,
        ori_pac_name: data.ori_pac_name,
        pac_apPrimero: data.pac_apPrimero,
        pac_apSegundo: data.pac_apSegundo,
        pac_ciudad: data.pac_ciudad,
        pac_cp: data.pac_cp,
        pac_curp: data.pac_curp,
        pac_dir_calle: data.pac_dir_calle,
        pac_dir_col: data.pac_dir_col,
        pac_email: data.pac_email,
        pac_escolaridad: data.pac_escolaridad,
        pac_estado: data.pac_estado,
        pac_estado_civil: data.pac_estado_civil,
        pac_fNacimiento: data.pac_fNacimiento,
        pac_edad: edad,
        pac_nomina: data.pac_nomina,
        pac_imss: data.pac_imss,
        pac_nombres: data.pac_nombres,
        pac_sexo: data.pac_sexo,
        pac_tel: data.pac_tel,
        pac_tipo_sangre: data.pac_tipo_sangre,
        subempresa: data.subempresa,
      });
      resolve();
    });
  }

  async cargarConsulta(id_consulta) {
    await new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas', ref => ref.
        where('id_consulta', '==', id_consulta)).valueChanges().subscribe(cons => {
          this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('incapacidades', ref => ref.
            where('id_consulta', '==', id_consulta)).valueChanges().subscribe(inca => {
              if (inca.length != 0) { this.tieneInca = true; } else { this.tieneInca = false; }
            });
          this.dataQuery = cons[0];
          resolve();
        });
    }).then(async () => {
      let val_evi_tipo = '';
      let valid = '';
      if (this.dataQuery.subir_evi == 'si') {
        if (this.fileURL != null) {
          valid = 'Archivo Actual';
          await this.dataFrom.patchValue({ valid_evi: valid });
          await this.storage.ref(this.dataQuery.urlfile).getDownloadURL().subscribe((URL) => {
            this.fileURL = URL;
          });
          val_evi_tipo = this.dataQuery.evi_tipo;
        }
      } else {
        val_evi_tipo = '';
        this.fileURL = '';
      }

      await this.dataFrom.patchValue({
        consu_fecha: new Date(this.dataQuery.consu_fecha.seconds * 1000),
        consu_turno: this.dataQuery.consu_turno,
        consu_tipo: this.dataQuery.consu_tipo,
        tipo_urge: this.dataQuery.tipo_urge,

        pre_arterial: this.dataQuery.pre_arterial,
        frec_cardiaca: this.dataQuery.frec_cardiaca,
        frec_respi: this.dataQuery.frec_respi,
        temperatura: this.dataQuery.temperatura,

        subir_evi: this.dataQuery.subir_evi,
        evi_tipo: val_evi_tipo,

        inca_aplica: this.dataQuery.inca_aplica,
        se_refiere: this.dataQuery.se_refiere,
        nombre_atiende: this.dataQuery.nombre_atiende,
      });

      if (this.dataQuery.consu_tipo != 'Riesgo de trabajo') {
        await this.dataFrom.patchValue({
          descripcion_sintomas: this.dataQuery.descripcion_sintomas,
          diagnostico_clinico: this.dataQuery.diagnostico_clinico,
          receta: this.dataQuery.receta,
          //consu_detalle: this.dataQuery.consu_detalle,
        })
      } else {
        await this.dataFrom.patchValue({
          accidente_faccidente: new Date(this.dataQuery.accidente_faccidente.seconds * 1000),
          accidente_facude: new Date(this.dataQuery.accidente_facude.seconds * 1000),
          accidente_atendio: this.dataQuery.accidente_atendio,
          accidente_tiporiesgo: this.dataQuery.accidente_tiporiesgo,
          accidente_supervisor: this.dataQuery.accidente_supervisor,
          //accidente_parteAfectada: this.dataQuery.accidente_parteAfectada,
          accidente_diagnostico: this.dataQuery.accidente_diagnostico,
          accidente_observacion: this.dataQuery.accidente_observacion,
          accidente_diag_general: this.dataQuery.accidente_diag_general,
        });

        const detalles_proteccion = this.dataQuery.accidente_parteAfectada
          .map((checked, index) => (checked ? this.listPartesCuerpo[index].id : null))
          .filter((value) => value !== null);

        this.selected = detalles_proteccion;

      }
    });
  }

  redirect() {
    if (this.dataEmpleado.componentConsu) {
      this.router.navigate(['/pages/consultas'],
        { queryParams: {}, skipLocationChange: true });
    } else {
      const { id_consulta, componentConsu, ...dataEmpleado } = this.dataEmpleado;
      this.router.navigate(['/pages/expediente'],
        { queryParams: { ...dataEmpleado }, skipLocationChange: true });
    }
  }

  getImagen(event: any) {
    if (event.urlImagen != null) {
      this.file = event.urlImagen;
      this.dataFrom.controls['valid_evi'].setValue('Nueva Imagen');
    }
  }

  getfirma_ate(event: any) {
    if (event.efirma != null) {
      this.efirma_atiende = event.efirma;
      this.dataFrom.controls['firma_atiende'].setValue('Nueva firma');
      this.cerrarModal();
    }
  }

  getfirma_pac(event: any) {
    if (event.efirma != null) {
      this.efirma_paciente = event.efirma;
      this.dataFrom.controls['firma_paciente'].setValue('Nueva firma');
    }
  }

  async onUpload(DATA_URL, id_consulta, typefile) {
    let filePath = '';

    if (typefile == 'file_fate') {
      filePath = this.auth.dataEmp.basedatos + '/' + this.dataEmpleado.id + '/consultas/' + id_consulta + '/urlfAtiende.png';
      const ref = this.storage.ref(filePath);
      const task = await ref.putString(DATA_URL, 'data_url');
    } else if (typefile == 'file_fpac') {
      filePath = this.auth.dataEmp.basedatos + '/' + this.dataEmpleado.id + '/consultas/' + id_consulta + '/urlfPaciente.png';
      const ref = this.storage.ref(filePath);
      const task = await ref.putString(DATA_URL, 'data_url');
    } else {
      if (this.dataFrom.value.evi_tipo == 'photo') {
        filePath = this.auth.dataEmp.basedatos + '/' + this.dataEmpleado.id + '/consultas/' + id_consulta + '/evi_capturada.jpg';
        const ref = this.storage.ref(filePath);
        const task = await ref.putString(DATA_URL, 'data_url');
      } else {
        filePath = this.auth.dataEmp.basedatos + '/' + this.dataEmpleado.id + '/consultas/' + id_consulta + '/evi_pdf.pdf';
        await this.storage.upload(filePath, DATA_URL).then(() => {
          console.log('Archivo subido');
        });
      }
    }
    return filePath;
  }

  upfile(event) {
    if (event.target.files.length > 0) {
      const f = event.target.files[0];
      this.file = f;
      this.dataFrom.controls['valid_evi'].setValue('Nuevo Archivo');
    }
  }

  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      this.updatequery();
    } else {
      this.savequery();
    }
  }

  async savequery() {
    this.loading = true;

    var post = this.dataFrom.value;
    const id_consulta = this.afs.createId();
    post['id_consulta'] = id_consulta;
    post['user_reg'] = this.auth.currentUserId;
    post['f_registro'] = new Date();
    post['id'] = this.dataEmpleado.id;
    post['estatus'] = 'creado';
    if (this.dataFrom.value.subir_evi == 'si') { post['urlfile'] = await this.onUpload(this.file, id_consulta, 'file_evi'); } else { post['urlfile'] = ''; }

    if (this.dataFrom.value.consu_tipo != 'Enfermedad general') {
      const detalles_proteccion = this.dataFrom.value.accidente_parteAfectada
        .map((checked, index) => (checked ? this.listPartesCuerpo[index].parte_cuerpo : null))
        .filter((value) => value !== null);

      post["accidente_parteAfectada"] = detalles_proteccion;
    }
    //post['urlfAtiende'] = await this.onUpload(this.efirma_atiende, id_consulta, 'file_fate');
    //post['urlfPaciente'] = await this.onUpload(this.efirma_paciente, id_consulta, 'file_fpac');

    post['urlPDF'] = await this.pdfservice.generarPDFConsulta(this.auth.dataEmp.basedatos, this.dataEmpleado, post);

    delete post['file'];
    delete post['valid_evi'];
    //delete post['firma_atiende'];
    //delete post['firma_paciente'];

    const ref = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas');
    ref.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
      const idNum = Number(c["counter"]) + 1;
      post["idNumerico"] = idNum;
      await ref.doc("counter").set({ counter: idNum }).then(async () => {
        await ref.doc(id_consulta).set(post).then(() => {
          this.loading = false;
          Swal.fire(
            '¡Datos Guardados!',
            'Los datos ha sido guardado correctamente',
            'success',
          ).then(async () => {
            this.fileURL = '';
            await this.redirect();
            if (this.dataFrom.value.inca_aplica == 'Si') {

              Swal.fire({
                title: 'Registrar Incapacidad',
                text: '¿Deseas agregar ahora una incapacidad?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
              }).then((result) => {
                if (result.value) {
                  this.addInca(id_consulta, this.dataEmpleado);
                }
              });
            }
            this.dataFrom.reset();
          });
        });
      });
    });
  }

  async updatequery() {
    this.loading = true;
    var post = this.dataFrom.value;
    post['user_update'] = this.auth.currentUserId;
    post['f_edit'] = new Date();
    post['estatus'] = 'actualizado';
    post['id_consulta'] = this.dataQuery.id_consulta;

    if (this.dataFrom.value.subir_evi == 'si') {
      if (this.dataFrom.value.valid_evi == 'Archivo Actual') {
        post['urlfile'] = this.dataQuery.urlfile;
      }
      else {
        post['urlfile'] = await this.onUpload(this.file, this.dataQuery.id_consulta, 'file_evi');
      }
    } else {
      post['urlfile'] = this.dataQuery.urlfile;
    }

    if (this.dataFrom.value.consu_tipo != 'Enfermedad general') {
      const detalles_proteccion = this.dataFrom.value.accidente_parteAfectada
        .map((checked, index) => (checked ? this.listPartesCuerpo[index].parte_cuerpo : null))
        .filter((value) => value !== null);

      post["accidente_parteAfectada"] = detalles_proteccion;
    }

    post['urlPDF'] = await this.pdfservice.generarPDFConsulta(this.auth.dataEmp.basedatos, this.dataEmpleado, post);
    delete post['file'];
    delete post['valid_evi'];
    delete post['id_consulta'];

    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas')
      .doc(this.dataQuery.id_consulta).update(post).then(() => {
        this.loading = false;
        Swal.fire(
          '¡Datos Actualizado!',
          'Los datos ha sido actualizados correctamente',
          'success',
        ).then(() => {
          this.redirect();
          if (this.dataFrom.value.inca_aplica == 'Si') {
            if (!this.tieneInca) {
              Swal.fire({
                title: 'Registrar Incapacidad',
                // eslint-disable-next-line max-len
                text: '¿Deseas agregar ahora una incapacidad?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.addInca(this.dataQuery.id_consulta, this.dataEmpleado);
                }
              });
            }
          }
        });
      });
  }

  addInca(id_consulta, Empleado) {
    const initialState = {
      idConsulta: id_consulta,
      currentEmpleado: Empleado,
      title_modal: 'Añadir incapacidad',
      modalTipo: 'addInca',
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };

/*     this.modalRefEvi = this.modalService.show(ModaldetalleComponent, {
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg', initialState
    }); */
  }

}
