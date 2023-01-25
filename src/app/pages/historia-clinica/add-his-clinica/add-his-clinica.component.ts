import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
const Swal = require('sweetalert2');
import { NbDateService, } from '@nebular/theme';

@Component({
  selector: 'dln-add-his-clinica',
  templateUrl: './add-his-clinica.component.html',
  styleUrls: ['./add-his-clinica.component.scss']
})
export class AddHisClinicaComponent implements OnInit {
  dataEmpleado: any;
  datosGeneralesFrom: FormGroup;
  dataFrom: FormGroup;

  valueNombre: string = '^([A-ZÀ-ÿ]{2,20})*( [A-ZÀ-ÿ]{2,20}){0,3}$';
  viewOtrosinput: boolean = false;
  view_enfe_detalle: boolean = false;
  mssbtn = "";

  //today = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');

  min: Date;
  max: Date;

  proteccion_personal = [
    { id: 1, proteccion: "Zapatos" },
    { id: 2, proteccion: "Lentes" },
    { id: 3, proteccion: "Tapones" },
    { id: 4, proteccion: "Mandil" },
    { id: 5, proteccion: "Manga" },
    { id: 6, proteccion: "Guantes" },
    { id: 7, proteccion: "Casco" },
    { id: 8, proteccion: "Careta" },
    { id: 9, proteccion: "Faja" },
    { id: 10, proteccion: "Tyvek" },
    { id: 11, proteccion: "Mascarilla" },
    { id: 12, proteccion: "Cubrebocas" },
    //{ id: 13, proteccion: "Otros" },
  ];

  agentes_exp = [
    { id: 1, genre: "Ruido" },
    { id: 2, genre: "Temperaturas extremas" },
    { id: 3, genre: "Vivraciones" },
    { id: 4, genre: "Posturas de pie" },
    { id: 5, genre: "Posturas sentado" },
    { id: 6, genre: "Mala iluminacion" },
    { id: 7, genre: "Polvos" },
    { id: 8, genre: "Vapores" },
    { id: 9, genre: "Radiaciones" },
    { id: 10, genre: "Manejo de carga" },
    { id: 11, genre: "Movimientos repetitivos de espalda, muñecas, hombros" },
  ];

  listEnfermedades = [
    { id: 1, enfermedad: ' Varicela ' },
    { id: 2, enfermedad: ' Paperas ' },
    { id: 3, enfermedad: ' Tuberculosis ' },
    { id: 4, enfermedad: ' Rubeola ' },
    { id: 5, enfermedad: ' Hepatitis ' },
    { id: 6, enfermedad: ' Oidos tapados ' },
    { id: 7, enfermedad: ' Dificultad para escuchar ' },
    { id: 8, enfermedad: ' Dolor, secreción de oídos ' },
    { id: 9, enfermedad: ' Obstrucción nariz ' },
    { id: 10, enfermedad: ' Secreción nariz ' },
    { id: 11, enfermedad: ' Sangrado nariz frecuente ' },
    { id: 12, enfermedad: ' Crisis de estornudos ' },
    { id: 13, enfermedad: ' Tos frecuente ' },
    { id: 14, enfermedad: ' Flema con sangre ' },
    { id: 15, enfermedad: ' Dificultad para respirar, asma ' },
    { id: 16, enfermedad: ' Silbido al respirar ' },
    { id: 17, enfermedad: ' Cansancio al caminar o correr ' },
    { id: 18, enfermedad: ' Cansancio al subir escaleras ' },
    { id: 19, enfermedad: ' Sensación opresión en el pecho ' },
    { id: 20, enfermedad: ' Palpitación, dolor en el pecho ' },
    { id: 21, enfermedad: ' Presión arterial alta ' },
    { id: 22, enfermedad: ' Mareo, vertigo o visión borrosa ' },
    { id: 23, enfermedad: ' Varices en las piernas o hemorroides ' },
    { id: 24, enfermedad: ' Vómito intenso ' },
    { id: 25, enfermedad: ' Ardor estomacal, agruras o indigestión ' },
    { id: 26, enfermedad: ' Evacuación con sangre ' },
    { id: 27, enfermedad: ' Aumento o disminución de peso ' },
    { id: 28, enfermedad: ' Cirujías, Operaciones ' },
    { id: 29, enfermedad: ' Azucar alta /diabetes ' },
    { id: 30, enfermedad: ' Dolor de la vesícula biliar ' },
    { id: 31, enfermedad: ' Fracturas, torceduras, luxaciones ' },
    { id: 32, enfermedad: ' Artritis ' },
    { id: 33, enfermedad: ' Lesión del algún tendón ' },
    { id: 34, enfermedad: ' Dolor cuello espalda, cintura ' },
    { id: 35, enfermedad: ' Ardor al orinar ' },
    { id: 36, enfermedad: ' Despertar con frecuencia para orinar ' },
    { id: 37, enfermedad: ' Cálculos o pideras en la orina ' },
    { id: 38, enfermedad: ' Dificultad para orinar ' },
    { id: 39, enfermedad: ' Sangre o coloración en la orina ' },
    { id: 40, enfermedad: ' Dificultad o dolor al tener relaciones ' },
    { id: 41, enfermedad: ' Secreciones anormales en el pene ' },
    { id: 42, enfermedad: ' Enfermedades de transmisión sexual ' },
    { id: 43, enfermedad: ' Practicas sexuales de riesgo ' },
    { id: 44, enfermedad: ' Dolor de cabeza frecuente ' },
    { id: 45, enfermedad: ' Paralisis en alguna parte del cuerpo ' },
    { id: 46, enfermedad: ' Ataques, convulsiones ' },
    { id: 47, enfermedad: ' Adormecimiento de brazos, manos o pies ' },
    { id: 48, enfermedad: ' Ronchas o comezón en la piel ' },
    { id: 49, enfermedad: ' Alergías a medicinas o alimentos ' },
    { id: 50, enfermedad: ' Comezón/Ardor en ojos, nariz, garganta ' },
    { id: 51, enfermedad: ' Hongos en piel o uñas ' },
    { id: 52, enfermedad: ' Dificultad para ver de cerca o lejos ' },
    { id: 53, enfermedad: ' Tiene tatuajes / perforaciones ' },
    { id: 54, enfermedad: ' Transfusiones ' },
    { id: 55, enfermedad: ' Enfermedad de tiroides ' },
  ];

  constructor(
    public router: Router,
    public route2: ActivatedRoute,
    public datepipe: DatePipe,
    private afs: AngularFirestore,
    public auth: AuthService,
    protected dateService: NbDateService<Date>,
  ) { 
    this.min = this.dateService.addMonth(this.dateService.today(), -2);
    this.max = this.dateService.today();
    this.datosGeneralesFrom = this.createFormGrup_dataGeneral();
    this.dataFrom = this.createFormGrup_dataform();
    this.onChanges();
  }

  ngOnInit(): void {

    this.route2.queryParams.subscribe(async params => {
      this.dataEmpleado = params;
      console.log(this.dataEmpleado);
      await this.cargardatoscontacto(this.dataEmpleado);
      if (!params.id_reporte) {
        this.dataFrom.patchValue({
          area: this.dataEmpleado.area,
          numnomina: this.dataEmpleado.pac_nomina,
        });
        this.mssbtn = "Guardar";
      } else {
        this.mssbtn = "Actualizar";
        await this.cargarReporte(params.id_reporte);
      }
    });

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

  createFormGrup_dataform() {
    const prote_pers = this.proteccion_personal.map((control) => new FormControl(false));
    const agente_expo = this.agentes_exp.map((control) => new FormControl(false));
    const enfermedades = this.listEnfermedades.map((control) => new FormControl(false));

    return new FormGroup({
      fechaRepo: new FormControl("", [Validators.required]),

      proteccion_perso: new FormArray(prote_pers),
      agentes_expo: new FormArray(agente_expo),
      list_enfe: new FormArray(enfermedades),
      enfe_detalle: new FormControl(""),

      contacto_nombre: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto_apPrimero: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto_apSegundo: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto_edad: new FormControl(""),
      contacto_telefono: new FormControl("", [Validators.pattern('[0-9]{10}')]),
      contacto_direccion: new FormControl(""),

      contacto2_nombre: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto2_apPrimero: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto2_apSegundo: new FormControl("", [Validators.pattern(this.valueNombre)]),
      contacto2_edad: new FormControl(""),
      contacto2_telefono: new FormControl("", [Validators.pattern('[0-9]{10}')]),
      contacto2_direccion: new FormControl(""),

      fechaingreso: new FormControl("",),//[Validators.required]),
      area: new FormControl("",),//[Validators.required]),
      numnomina: new FormControl("",),//[Validators.required]),
      puestoac: new FormControl("",),//[Validators.required]),
      tiempopues: new FormControl("",),//[Validators.required]),
      puestoacdesc: new FormControl("",),//[Validators.required]),

      ruido_rb: new FormControl(""),
      vibraciones_rb: new FormControl(""),
      temp_extrem_rb: new FormControl(""),
      polvo_rb: new FormControl(""),
      humo_rb: new FormControl(""),
      vapores_rb: new FormControl(""),
      sust_quimicas_rb: new FormControl(""),
      exp_biologico_rb: new FormControl(""),

      ergopuesto: new FormControl("",),//[Validators.required]),
      tamapuesto: new FormControl("",),//[Validators.required]),
      actitronco: new FormControl("",),//[Validators.required]),
      actiNivelTronco: new FormControl("",),//[Validators.required]),
      actiHombros: new FormControl("",),//[Validators.required]),
      moviMuneca: new FormControl("",),//[Validators.required]),
      manejocarga: new FormControl("",),//[Validators.required]),
      descmovi: new FormControl(""),
      tipocarga: new FormControl(""),
      protecciondetalle: new FormControl("",),//[Validators.required]),
      actividadreptronco: new FormControl("",),//[Validators.required]),
      puestoanterior: new FormControl("",),//[Validators.required]),
      tiempuesto: new FormControl("",),//[Validators.required]),
      accidentesufridos: new FormControl("",),//[Validators.required]),

      rb_ruido: new FormControl(""),
      rb_temperatura: new FormControl(""),
      rb_vibraciones: new FormControl(""),
      rb_postpie: new FormControl(""),
      rb_postsentado: new FormControl(""),
      rb_iluminacion: new FormControl(""),
      rb_polvo: new FormControl(""),
      rb_vapor: new FormControl(""),
      rb_radiacion: new FormControl(""),
      rb_manejocarga: new FormControl(""),
      rb_movirepetitivo: new FormControl(""),

      accidente_sufrido: new FormControl("",),//[Validators.required]),
      enfe_trabajo: new FormControl("",),//[Validators.required]),
      detalle_accidente: new FormControl("",),//[Validators.required]),
      detalle_enfermedad: new FormControl("",),//[Validators.required]),

      diabetes: new FormControl("",),//[Validators.required]),
      diabetes_fam: new FormControl({ value: "", disabled: true }),
      hipertension: new FormControl("",),//[Validators.required]),
      hipertension_fam: new FormControl({ value: "", disabled: true }),
      presionbaja: new FormControl("",),//[Validators.required]),
      presionbaja_fam: new FormControl({ value: "", disabled: true }),
      probcardio: new FormControl("",),//[Validators.required]),
      probcardio_fam: new FormControl({ value: "", disabled: true }),
      probpulmonar: new FormControl("",),//[Validators.required]),
      probpulmonar_fam: new FormControl({ value: "", disabled: true }),
      probrenal: new FormControl("",),//[Validators.required]),
      probrenal_fam: new FormControl({ value: "", disabled: true }),
      problhepatico: new FormControl("",),//[Validators.required]),
      problhepatico_fam: new FormControl({ value: "", disabled: true }),
      enfersangre: new FormControl("",),//[Validators.required]),
      enfersangre_fam: new FormControl({ value: "", disabled: true }),
      ansi_depre_ezquizo: new FormControl("",),//[Validators.required]),
      ansi_depre_ezquizo_fam: new FormControl({ value: "", disabled: true }),
      convulcion_epilecia: new FormControl("",),//[Validators.required]),
      convulcion_epilecia_fam: new FormControl({ value: "", disabled: true }),
      cancer_tumor: new FormControl("",),//[Validators.required]),
      cancer_tumor_fam: new FormControl({ value: "", disabled: true }),
      enboloa_derrame: new FormControl("",),//[Validators.required]),
      enboloa_derrame_fam: new FormControl({ value: "", disabled: true }),
      probltiroides: new FormControl("",),//[Validators.required]),
      probltiroides_fam: new FormControl({ value: "", disabled: true }),
      obecidad: new FormControl("",),//[Validators.required]),
      obecidad_fam: new FormControl({ value: "", disabled: true }),
      problvisual: new FormControl("",),//[Validators.required]),
      problvisual_fam: new FormControl({ value: "", disabled: true }),
      alergias: new FormControl("",),//[Validators.required]),
      alergias_fam: new FormControl({ value: "", disabled: true }),
      defcongenitos: new FormControl("",),//[Validators.required]),
      defcongenitos_fam: new FormControl({ value: "", disabled: true }),
      problhuesos: new FormControl("",),//[Validators.required]),
      problhuesos_fam: new FormControl({ value: "", disabled: true }),

      casahabita: new FormControl("",),//[Validators.required]),
      cuenta_servicios: new FormControl("",),//[Validators.required]),
      numpersonas_viven: new FormControl("",),//[Validators.required]),
      cuantasmenores: new FormControl("",),//[Validators.required]),g
      cuantasmayores: new FormControl("",),//[Validators.required]),

      familiar_enfe_gravedad: new FormControl("",),//[Validators.required]),
      familiar_enfe_gravedad_fam: new FormControl({ value: "", disabled: true }),
      mascotas: new FormControl("",),//[Validators.required]),
      mascotas_detalle: new FormControl({ value: "", disabled: true }),
      ustedfuma: new FormControl("",),//[Validators.required]),
      ustedfuma_detalle: new FormControl({ value: "", disabled: true }),
      bebidaalcoholica: new FormControl("",),//[Validators.required]),
      bebidaalcoholica_detalle: new FormControl({ value: "", disabled: true }),
      consumedrogas: new FormControl("",),//[Validators.required]),
      consumedrogas_detalle: new FormControl({ value: "", disabled: true }),
      haceejercicio: new FormControl("",),//[Validators.required]),
      haceejercicio_detalle: new FormControl({ value: "", disabled: true }),

      comidaxdia: new FormControl("",),//[Validators.required]),
      litrosagua: new FormControl("",),//[Validators.required]),
      verduras: new FormControl("",),//[Validators.required]),
      frutas: new FormControl("",),//[Validators.required]),
      pastas: new FormControl("",),//[Validators.required]),
      carneroja: new FormControl("",),//[Validators.required]),
      carneblanca: new FormControl("",),//[Validators.required]),
      leguminosas: new FormControl("",),//[Validators.required]),
      lacteos: new FormControl("",),//[Validators.required]),
      cereales: new FormControl("",),//[Validators.required]),
      embutidos: new FormControl("",),//[Validators.required]),
      chatarra: new FormControl("",),//[Validators.required]),
      vacuna_completo: new FormControl("",),//[Validators.required]),
      vacuna_covid: new FormControl("",),//[Validators.required]),
      influenza_estacional: new FormControl("",),//[Validators.required]),
      tetanos: new FormControl("",),//[Validators.required]),
      hepatitis_b: new FormControl("",),//[Validators.required]),
      transfucion_sangre: new FormControl("",),//[Validators.required]),

      menarca: new FormControl("",),//[Validators.required]),
      inicio_vidasexual: new FormControl("",),//[Validators.required]),
      metodoplanificacion: new FormControl("",),//[Validators.required]),
      gestas: new FormControl("",),//[Validators.required]),
      cesareas: new FormControl("",),//[Validators.required]),
      abortos: new FormControl("",),//[Validators.required]),
      metodo_utiliza: new FormControl("",),//[Validators.required]),
      ultimo_parto: new FormControl("",),//[Validators.required]),
      ultima_expl_mamaria: new FormControl("",),//[Validators.required]),
      ultima_mastografia: new FormControl("",),//[Validators.required]),
      resultado_expl_mamaria: new FormControl("",),//[Validators.required]),

      peso: new FormControl("",),//[Validators.required]),
      talla: new FormControl("",),//[Validators.required]),
      imc: new FormControl("",),//[Validators.required]),
      dxtx: new FormControl("",),//[Validators.required]),
      ta_izquierdo: new FormControl("",),//[Validators.required]),
      ta_derecho: new FormControl("",),//[Validators.required]),
      fc: new FormControl("",),//[Validators.required]),
      fr: new FormControl("",),//[Validators.required]),
      temp: new FormControl("",),//[Validators.required]),
      agudeza_visual: new FormControl("",),//[Validators.required]),
      binocular: new FormControl("",),//[Validators.required]),
      c_c: new FormControl("",),//[Validators.required]),
      sinlentes_d: new FormControl("",),//[Validators.required]),
      sinlentes_i: new FormControl("",),//[Validators.required]),
      conlentes_d: new FormControl("",),//[Validators.required]),
      conlentes_i: new FormControl("",),//[Validators.required]),
      agudeza_visual_cercana: new FormControl("",),//[Validators.required]),
      campinteria: new FormControl("",),//[Validators.required]),
      daltonismo: new FormControl("",),//[Validators.required]),

      cabeza: new FormControl("",),//[Validators.required]),
      craneo: new FormControl("",),//[Validators.required]),
      cara: new FormControl("",),//[Validators.required]),
      pupilas: new FormControl("",),//[Validators.required]),
      conjuntivas: new FormControl("",),//[Validators.required]),
      nariz: new FormControl("",),//[Validators.required]),
      boca: new FormControl("",),//[Validators.required]),
      cavidad_oral: new FormControl("",),//[Validators.required]),
      amigdalas: new FormControl("",),//[Validators.required]),
      faringe: new FormControl("",),//[Validators.required]),
      estado_dental: new FormControl("",),//[Validators.required]),
      oido_izquierdo: new FormControl("",),//[Validators.required]),
      oido_derecho: new FormControl("",),//[Validators.required]),
      cuello: new FormControl("",),//[Validators.required]),
      torax: new FormControl("",),//[Validators.required]),
      mov_respiratorios: new FormControl("",),//[Validators.required]),
      ruidos_cardiacos: new FormControl("",),//[Validators.required]),
      campos_pulmonares: new FormControl("",),//[Validators.required]),
      mamas: new FormControl("",),//[Validators.required]),
      abdomen: new FormControl("",),//[Validators.required]),
      auscultacion: new FormControl("",),//[Validators.required]),
      palpaciones: new FormControl("",),//[Validators.required]),
      visceromealias: new FormControl("",),//[Validators.required]),
      hernias: new FormControl("",),//[Validators.required]),
      tumoraciones: new FormControl("",),//[Validators.required]),
      genitales: new FormControl("",),//[Validators.required]),
      urinario: new FormControl("",),//[Validators.required]),
      columna: new FormControl("",),//[Validators.required]),
      extremidades_sup: new FormControl("",),//[Validators.required]),
      extremidades_inf: new FormControl("",),//[Validators.required]),
      piel: new FormControl("",),//[Validators.required]),
      sistema_nervioso: new FormControl("",),//[Validators.required]),
      diagnostico_clinico: new FormControl("",),//[Validators.required]),
      observaciones: new FormControl("",),//[Validators.required]),
      recomendaciones: new FormControl("",),//[Validators.required]),
    });
  }

  get fg() { return this.datosGeneralesFrom.controls; }
  get df() { return this.dataFrom.controls; }


  onChanges(): void {

    this.dataFrom.get("moviMuneca").valueChanges.subscribe((val) => {
      if (val == 'si') {
        this.dataFrom.get("descmovi").enable();
        this.dataFrom.get("descmovi").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("descmovi").disable();
        this.dataFrom.get("descmovi").clearValidators();
      }
    });
    this.dataFrom.get("manejocarga").valueChanges.subscribe((val) => {
      if (val == 'si') {
        this.viewOtrosinput = true;
        this.dataFrom.get("tipocarga").enable();
        this.dataFrom.get("tipocarga").setValidators([Validators.required]);
      } else {
        this.viewOtrosinput = false;
        this.dataFrom.get("tipocarga").disable();
        this.dataFrom.get("tipocarga").clearValidators();
      }
    });

    //********************************************************************************************************************************

    this.dataFrom.get("list_enfe").valueChanges.subscribe((val) => {
      if (val.includes(true)) {
        this.view_enfe_detalle = true;
        this.dataFrom.get("enfe_detalle").enable();
        this.dataFrom.get("enfe_detalle").setValidators([Validators.required]);
      } else {
        this.view_enfe_detalle = false;
        this.dataFrom.get("enfe_detalle").disable();
        this.dataFrom.get("enfe_detalle").clearValidators();
      }
    });

    //********************************************************************************************************************************

    this.dataFrom.get("accidente_sufrido").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("detalle_accidente").enable();
        this.dataFrom.get("detalle_accidente").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("detalle_accidente").disable();
        this.dataFrom.get("detalle_accidente").clearValidators();
      }
    });
    this.dataFrom.get("enfe_trabajo").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("detalle_enfermedad").enable();
        this.dataFrom.get("detalle_enfermedad").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("detalle_enfermedad").disable();
        this.dataFrom.get("detalle_enfermedad").clearValidators();
      }
    });

    //********************************************************************************************************************************

    this.dataFrom.get("diabetes").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("diabetes_fam").enable();
        this.dataFrom.get("diabetes_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("diabetes_fam").disable();
        this.dataFrom.get("diabetes_fam").clearValidators();
      }
    });
    this.dataFrom.get("hipertension").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("hipertension_fam").enable();
        this.dataFrom.get("hipertension_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("hipertension_fam").disable();
        this.dataFrom.get("hipertension_fam").clearValidators();
      }
    });
    this.dataFrom.get("presionbaja").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("presionbaja_fam").enable();
        this.dataFrom.get("presionbaja_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("presionbaja_fam").disable();
        this.dataFrom.get("presionbaja_fam").clearValidators();
      }
    });
    this.dataFrom.get("probcardio").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("probcardio_fam").enable();
        this.dataFrom.get("probcardio_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("probcardio_fam").disable();
        this.dataFrom.get("probcardio_fam").clearValidators();
      }
    });
    this.dataFrom.get("probpulmonar").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("probpulmonar_fam").enable();
        this.dataFrom.get("probpulmonar_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("probpulmonar_fam").disable();
        this.dataFrom.get("probpulmonar_fam").clearValidators();
      }
    });
    this.dataFrom.get("probrenal").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("probrenal_fam").enable();
        this.dataFrom.get("probrenal_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("probrenal_fam").disable();
        this.dataFrom.get("probrenal_fam").clearValidators();
      }
    });
    this.dataFrom.get("problhepatico").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("problhepatico_fam").enable();
        this.dataFrom.get("diabetes_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("problhepatico_fam").disable();
        this.dataFrom.get("problhepatico_fam").clearValidators();
      }
    });
    this.dataFrom.get("enfersangre").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("enfersangre_fam").enable();
        this.dataFrom.get("enfersangre_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("enfersangre_fam").disable();
        this.dataFrom.get("enfersangre_fam").clearValidators();
      }
    });
    this.dataFrom.get("ansi_depre_ezquizo").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("ansi_depre_ezquizo_fam").enable();
        this.dataFrom.get("ansi_depre_ezquizo_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("ansi_depre_ezquizo_fam").disable();
        this.dataFrom.get("ansi_depre_ezquizo_fam").clearValidators();
      }
    });
    this.dataFrom.get("convulcion_epilecia").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("convulcion_epilecia_fam").enable();
        this.dataFrom.get("convulcion_epilecia_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("convulcion_epilecia_fam").disable();
        this.dataFrom.get("convulcion_epilecia_fam").clearValidators();
      }
    });
    this.dataFrom.get("cancer_tumor").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("cancer_tumor_fam").enable();
        this.dataFrom.get("cancer_tumor_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("cancer_tumor_fam").disable();
        this.dataFrom.get("cancer_tumor_fam").clearValidators();
      }
    });
    this.dataFrom.get("enboloa_derrame").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("enboloa_derrame_fam").enable();
        this.dataFrom.get("enboloa_derrame_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("enboloa_derrame_fam").disable();
        this.dataFrom.get("enboloa_derrame_fam").clearValidators();
      }
    });
    this.dataFrom.get("probltiroides").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("probltiroides_fam").enable();
        this.dataFrom.get("probltiroides_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("probltiroides_fam").disable();
        this.dataFrom.get("probltiroides_fam").clearValidators();
      }
    });
    this.dataFrom.get("obecidad").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("obecidad_fam").enable();
        this.dataFrom.get("obecidad_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("obecidad_fam").disable();
        this.dataFrom.get("obecidad_fam").clearValidators();
      }
    });
    this.dataFrom.get("problvisual").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("problvisual_fam").enable();
        this.dataFrom.get("problvisual_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("problvisual_fam").disable();
        this.dataFrom.get("problvisual_fam").clearValidators();
      }
    });
    this.dataFrom.get("alergias").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("alergias_fam").enable();
        this.dataFrom.get("alergias_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("alergias_fam").disable();
        this.dataFrom.get("alergias_fam").clearValidators();
      }
    });
    this.dataFrom.get("defcongenitos").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("defcongenitos_fam").enable();
        this.dataFrom.get("defcongenitos_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("defcongenitos_fam").disable();
        this.dataFrom.get("defcongenitos_fam").clearValidators();
      }
    });
    this.dataFrom.get("problhuesos").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("problhuesos_fam").enable();
        this.dataFrom.get("problhuesos_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("problhuesos_fam").disable();
        this.dataFrom.get("problhuesos_fam").clearValidators();
      }
    });

    //********************************************************************************************************************************
    this.dataFrom.get("familiar_enfe_gravedad").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("familiar_enfe_gravedad_fam").enable();
        this.dataFrom.get("familiar_enfe_gravedad_fam").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("familiar_enfe_gravedad_fam").disable();
        this.dataFrom.get("familiar_enfe_gravedad_fam").clearValidators();
      }
    });
    this.dataFrom.get("mascotas").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("mascotas_detalle").enable();
        this.dataFrom.get("mascotas_detalle").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("mascotas_detalle").disable();
        this.dataFrom.get("mascotas_detalle").clearValidators();
      }
    });
    this.dataFrom.get("ustedfuma").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("ustedfuma_detalle").enable();
        this.dataFrom.get("ustedfuma_detalle").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("ustedfuma_detalle").disable();
        this.dataFrom.get("ustedfuma_detalle").clearValidators();
      }
    });
    this.dataFrom.get("bebidaalcoholica").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("bebidaalcoholica_detalle").enable();
        this.dataFrom.get("bebidaalcoholica_detalle").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("bebidaalcoholica_detalle").disable();
        this.dataFrom.get("bebidaalcoholica_detalle").clearValidators();
      }
    });
    this.dataFrom.get("consumedrogas").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("consumedrogas_detalle").enable();
        this.dataFrom.get("consumedrogas_detalle").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("consumedrogas_detalle").disable();
        this.dataFrom.get("consumedrogas_detalle").clearValidators();
      }
    });
    this.dataFrom.get("haceejercicio").valueChanges.subscribe((value) => {
      if (value == 'si') {
        this.dataFrom.get("haceejercicio_detalle").enable();
        this.dataFrom.get("haceejercicio_detalle").setValidators([Validators.required]);
      } else {
        this.dataFrom.get("haceejercicio_detalle").disable();
        this.dataFrom.get("haceejercicio_detalle").clearValidators();
      }
    });

    //********************************************************************************************************************************

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

  async cargarReporte(id_reporte) {
    var reporte;
    await new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('expedientelaboral', ref => ref.
        where('id_reportelab', '==', id_reporte)).valueChanges().subscribe(rep => {
          reporte = rep[0];
          resolve();
        });
    }).then(() => {

      if (reporte.fechaingreso.seconds) { this.dataFrom.patchValue({ fechaingreso: new Date(reporte.fechaingreso.seconds * 1000) }) }

      this.dataFrom.patchValue({
        fechaRepo: new Date(reporte.fechaRepo.seconds * 1000),
        enfe_detalle: reporte.enfe_detalle,
        contacto_nombre: reporte.contacto_nombre,
        contacto_apPrimero: reporte.contacto_apPrimero,
        contacto_apSegundo: reporte.contacto_apSegundo,
        contacto_edad: reporte.contacto_edad,
        contacto_telefono: reporte.contacto_telefono,
        contacto_direccion: reporte.contacto_direccion,
        contacto2_nombre: reporte.contacto2_nombre,
        contacto2_apPrimero: reporte.contacto2_apPrimero,
        contacto2_apSegundo: reporte.contacto2_apSegundo,
        contacto2_edad: reporte.contacto2_edad,
        contacto2_telefono: reporte.contacto2_telefono,
        contacto2_direccion: reporte.contacto2_direccion,

        area: reporte.area,
        numnomina: reporte.numnomina,

        puestoac: reporte.puestoac,
        tiempopues: reporte.tiempopues,
        puestoacdesc: reporte.puestoacdesc,
        ruido_rb: reporte.ruido_rb,
        vibraciones_rb: reporte.vibraciones_rb,
        temp_extrem_rb: reporte.temp_extrem_rb,
        polvo_rb: reporte.polvo_rb,
        humo_rb: reporte.humo_rb,
        vapores_rb: reporte.vapores_rb,
        sust_quimicas_rb: reporte.sust_quimicas_rb,
        exp_biologico_rb: reporte.exp_biologico_rb,
        ergopuesto: reporte.ergopuesto,
        tamapuesto: reporte.tamapuesto,
        actitronco: reporte.actitronco,
        actiNivelTronco: reporte.actiNivelTronco,
        actiHombros: reporte.actiHombros,
        moviMuneca: reporte.moviMuneca,
        manejocarga: reporte.manejocarga,
        descmovi: reporte.descmovi,
        tipocarga: reporte.tipocarga,
        protecciondetalle: reporte.protecciondetalle,
        actividadreptronco: reporte.actividadreptronco,
        puestoanterior: reporte.puestoanterior,
        tiempuesto: reporte.tiempuesto,
        accidentesufridos: reporte.accidentesufridos,
        rb_ruido: reporte.rb_ruido,
        rb_temperatura: reporte.rb_temperatura,
        rb_vibraciones: reporte.rb_vibraciones,
        rb_postpie: reporte.rb_postpie,
        rb_postsentado: reporte.rb_postsentado,
        rb_iluminacion: reporte.rb_iluminacion,
        rb_polvo: reporte.rb_polvo,
        rb_vapor: reporte.rb_vapor,
        rb_radiacion: reporte.rb_radiacion,
        rb_manejocarga: reporte.rb_manejocarga,
        rb_movirepetitivo: reporte.rb_movirepetitivo,
        accidente_sufrido: reporte.accidente_sufrido,
        enfe_trabajo: reporte.enfe_trabajo,
        detalle_accidente: reporte.detalle_accidente,
        detalle_enfermedad: reporte.detalle_enfermedad,
        diabetes: reporte.diabetes,
        diabetes_fam: reporte.diabetes_fam,
        hipertension: reporte.hipertension,
        hipertension_fam: reporte.hipertension_fam,
        presionbaja: reporte.presionbaja,
        presionbaja_fam: reporte.presionbaja_fam,
        probcardio: reporte.probcardio,
        probcardio_fam: reporte.probcardio_fam,
        probpulmonar: reporte.probpulmonar,
        probpulmonar_fam: reporte.probpulmonar_fam,
        probrenal: reporte.probrenal,
        probrenal_fam: reporte.probrenal_fam,
        problhepatico: reporte.problhepatico,
        problhepatico_fam: reporte.problhepatico_fam,
        enfersangre: reporte.enfersangre,
        enfersangre_fam: reporte.enfersangre_fam,
        ansi_depre_ezquizo: reporte.ansi_depre_ezquizo,
        ansi_depre_ezquizo_fam: reporte.ansi_depre_ezquizo_fam,
        convulcion_epilecia: reporte.convulcion_epilecia,
        convulcion_epilecia_fam: reporte.convulcion_epilecia_fam,
        cancer_tumor: reporte.cancer_tumor,
        cancer_tumor_fam: reporte.cancer_tumor_fam,
        enboloa_derrame: reporte.enboloa_derrame,
        enboloa_derrame_fam: reporte.enboloa_derrame_fam,
        probltiroides: reporte.probltiroides,
        probltiroides_fam: reporte.probltiroides_fam,
        obecidad: reporte.obecidad,
        obecidad_fam: reporte.obecidad_fam,
        problvisual: reporte.problvisual,
        problvisual_fam: reporte.problvisual_fam,
        alergias: reporte.alergias,
        alergias_fam: reporte.alergias_fam,
        defcongenitos: reporte.defcongenitos,
        defcongenitos_fam: reporte.defcongenitos_fam,
        problhuesos: reporte.problhuesos,
        problhuesos_fam: reporte.problhuesos_fam,
        casahabita: reporte.casahabita,
        cuenta_servicios: reporte.cuenta_servicios,
        numpersonas_viven: reporte.numpersonas_viven,
        cuantasmenores: reporte.cuantasmenores,
        cuantasmayores: reporte.cuantasmayores,
        familiar_enfe_gravedad: reporte.familiar_enfe_gravedad,
        familiar_enfe_gravedad_fam: reporte.familiar_enfe_gravedad_fam,
        mascotas: reporte.mascotas,
        mascotas_detalle: reporte.mascotas_detalle,
        ustedfuma: reporte.ustedfuma,
        ustedfuma_detalle: reporte.ustedfuma_detalle,
        bebidaalcoholica: reporte.bebidaalcoholica,
        bebidaalcoholica_detalle: reporte.bebidaalcoholica_detalle,
        consumedrogas: reporte.consumedrogas,
        consumedrogas_detalle: reporte.consumedrogas_detalle,
        haceejercicio: reporte.haceejercicio,
        haceejercicio_detalle: reporte.haceejercicio_detalle,
        comidaxdia: reporte.comidaxdia,
        litrosagua: reporte.litrosagua,
        verduras: reporte.verduras,
        frutas: reporte.frutas,
        pastas: reporte.pastas,
        carneroja: reporte.carneroja,
        carneblanca: reporte.carneblanca,
        leguminosas: reporte.leguminosas,
        lacteos: reporte.lacteos,
        cereales: reporte.cereales,
        embutidos: reporte.embutidos,
        chatarra: reporte.chatarra,
        vacuna_completo: reporte.vacuna_completo,
        vacuna_covid: reporte.vacuna_covid,
        influenza_estacional: reporte.influenza_estacional,
        tetanos: reporte.tetanos,
        hepatitis_b: reporte.hepatitis_b,
        transfucion_sangre: reporte.transfucion_sangre,

        menarca: reporte.menarca,
        inicio_vidasexual: reporte.inicio_vidasexual,
        metodoplanificacion: reporte.metodoplanificacion,
        gestas: reporte.gestas,
        cesareas: reporte.cesareas,
        abortos: reporte.abortos,
        metodo_utiliza: reporte.metodo_utiliza,
        ultimo_parto: reporte.ultimo_parto,
        ultima_expl_mamaria: reporte.ultima_expl_mamaria,
        ultima_mastografia: reporte.ultima_mastografia,
        resultado_expl_mamaria: reporte.resultado_expl_mamaria,

        peso: reporte.peso,
        talla: reporte.talla,
        imc: reporte.imc,
        dxtx: reporte.dxtx,
        ta_izquierdo: reporte.ta_izquierdo,
        ta_derecho: reporte.ta_derecho,
        fc: reporte.fc,
        fr: reporte.fr,
        temp: reporte.temp,
        agudeza_visual: reporte.agudeza_visual,
        binocular: reporte.binocular,
        c_c: reporte.c_c,
        sinlentes_d: reporte.sinlentes_d,
        sinlentes_i: reporte.sinlentes_i,
        conlentes_d: reporte.conlentes_d,
        conlentes_i: reporte.conlentes_i,
        agudeza_visual_cercana: reporte.agudeza_visual_cercana,
        campinteria: reporte.campinteria,
        daltonismo: reporte.daltonismo,
        cabeza: reporte.cabeza,
        craneo: reporte.craneo,
        cara: reporte.cara,
        pupilas: reporte.pupilas,
        conjuntivas: reporte.conjuntivas,
        nariz: reporte.nariz,
        boca: reporte.boca,
        cavidad_oral: reporte.cavidad_oral,
        amigdalas: reporte.amigdalas,
        faringe: reporte.faringe,
        estado_dental: reporte.estado_dental,
        oido_izquierdo: reporte.oido_izquierdo,
        oido_derecho: reporte.oido_derecho,
        cuello: reporte.cuello,
        torax: reporte.torax,
        mov_respiratorios: reporte.mov_respiratorios,
        ruidos_cardiacos: reporte.ruidos_cardiacos,
        campos_pulmonares: reporte.campos_pulmonares,
        mamas: reporte.mamas,
        abdomen: reporte.abdomen,
        auscultacion: reporte.auscultacion,
        palpaciones: reporte.palpaciones,
        visceromealias: reporte.visceromealias,
        hernias: reporte.hernias,
        tumoraciones: reporte.tumoraciones,
        genitales: reporte.genitales,
        urinario: reporte.urinario,
        columna: reporte.columna,
        extremidades_sup: reporte.extremidades_sup,
        extremidades_inf: reporte.extremidades_inf,
        piel: reporte.piel,
        sistema_nervioso: reporte.sistema_nervioso,
        diagnostico_clinico: reporte.diagnostico_clinico,
        observaciones: reporte.observaciones,
        recomendaciones: reporte.recomendaciones,
      });

      let porteccionper = this.dataFrom.get('proteccion_perso') as FormArray;
      for (let i = 0; porteccionper.length > i; i++) {
        if (reporte.proteccion_perso.includes(this.proteccion_personal[i].proteccion)) {
          porteccionper.at(i).setValue(true)
        }
      }
      let agente_expo = this.dataFrom.get('agentes_expo') as FormArray;
      for (let i = 0; agente_expo.length > i; i++) {
        if (reporte.agentes_expo.includes(this.agentes_exp[i].genre)) {
          agente_expo.at(i).setValue(true)
        }
      }
      let enfermedades = this.dataFrom.get('list_enfe') as FormArray;
      for (let i = 0; enfermedades.length > i; i++) {
        if (reporte.list_enfe.includes(this.listEnfermedades[i].enfermedad)) {
          enfermedades.at(i).setValue(true)
        }
      }
      console.log('Prueba', this.dataFrom.get('list_enfe'))
    });
  }

  redirect() {
    /* const { id_reporte, ...dataEmpleado } = this.dataEmpleado;
    this.router.navigate(['/pages/expediente'], //historial'],
      { queryParams: { ...dataEmpleado }, skipLocationChange: true }); */

      this.router.navigate(['/pages/historia-clinica'], //historial'],
      { queryParams: { }, skipLocationChange: true });
  }

  onKeydown(event) {
    const campo = event.srcElement.attributes.formcontrolname.nodeValue;
    let value: string = this.dataFrom.controls[campo].value;
    value = value.toUpperCase();
    this.dataFrom.controls[campo].setValue(value);
  }

  btnAccion() {
    if (this.mssbtn == 'Actualizar') {
      this.updatereport();
    } else {
      this.savereport();
    }
  }

  savereport() {

    var post = this.dataFrom.value;
    const id_reportelab = this.afs.createId();
    post['id_reportelab'] = id_reportelab;
    post['user_reg'] = this.auth.currentUserId;
    post['f_registro'] = new Date();
    post['id'] = this.dataEmpleado.id;
    post['estatus'] = 'creado';

    const detalles_proteccion = this.dataFrom.value.proteccion_perso
      .map((checked, index) => (checked ? this.proteccion_personal[index].proteccion : null))
      .filter((value) => value !== null);
    post["proteccion_perso"] = detalles_proteccion;

    const detalles_agentes_exp = this.dataFrom.value.agentes_expo
      .map((checked, index) => (checked ? this.agentes_exp[index].genre : null))
      .filter((value) => value !== null);
    post["agentes_expo"] = detalles_agentes_exp;

    const detalles_enfermedades = this.dataFrom.value.list_enfe
      .map((checked, index) => (checked ? this.listEnfermedades[index].enfermedad : null))
      .filter((value) => value !== null);
    post["list_enfe"] = detalles_enfermedades;

    const ref = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('Historias_Clinicas');
    ref.doc("counter").valueChanges().pipe(take(1)).subscribe(async (c) => {
      const idNum = Number(c["counter"]) + 1;
      post["idNumerico"] = idNum;
      await ref.doc("counter").set({ counter: idNum }).then(async () => {
        await ref.doc(id_reportelab).set(post).then(() => {
          Swal.fire(
            '¡Datos Guardados!',
            'Los datos ha sido guardado correctamente',
            'success',
          ).then(() => {
            this.datosGeneralesFrom.reset();
            this.dataFrom.reset();
            this.redirect();
          });
        });
      });
    });
  }

  async updatereport() {

    var post = this.dataFrom.value;
    post['user_update'] = this.auth.currentUserId;
    post['f_edit_reporte'] = new Date();
    post['estatus'] = 'actualizado';

    const detalles_proteccion = this.dataFrom.value.proteccion_perso
      .map((checked, index) => (checked ? this.proteccion_personal[index].proteccion : null))
      .filter((value) => value !== null);
    post["proteccion_perso"] = detalles_proteccion;

    const detalles_agentes_exp = this.dataFrom.value.agentes_expo
      .map((checked, index) => (checked ? this.agentes_exp[index].genre : null))
      .filter((value) => value !== null);
    post["agentes_expo"] = detalles_agentes_exp;

    const detalles_enfermedades = this.dataFrom.value.list_enfe
      .map((checked, index) => (checked ? this.listEnfermedades[index].enfermedad : null))
      .filter((value) => value !== null);
    post["list_enfe"] = detalles_enfermedades;

    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('expedientelaboral').doc(this.dataEmpleado.id_reporte).update(post).then(() => {
      Swal.fire(
        '¡Datos Actualizado!',
        'Los datos ha sido actualizados correctamente',
        'success',
      ).then(() => {
        this.redirect();
      });
    });
  }

}
