import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { ServicesExamenesMedicosService } from '../../../services/examenes-medicos/services-examenes-medicos.service';

@Component({
  selector: 'dln-add-examen-medico',
  templateUrl: './add-examen-medico.component.html',
  styleUrls: ['./add-examen-medico.component.scss']
})
export class AddExamenMedicoComponent implements OnInit {

  loading: boolean = false;
  currentEmpleado: any = null;
  currentExamenMedico: any = null;
  currentBTN: string = 'save';
  currentAction: string = null;
  dataFrom: FormGroup;

  hombro_der = [];
  hombro_izq = [];
  muneca_der = [];
  muneca_izq = [];
  torax = [];
  columna_cervical = [];
  columna_dorsal = [];
  columna_lumbar = [];
  columna_cervical_otras: boolean = false;
  columna_dorsal_otras: boolean = false;
  columna_lumbar_otras: boolean = false;

  disableSelect: boolean = true;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private ServiceExaMed: ServicesExamenesMedicosService,
    public fb: FormBuilder,

  ) {
    this.dataFrom = this.createFormGrup_dataform();
    if (this.router.getCurrentNavigation() != null) {
      this.route.params.subscribe(async params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.currentEmpleado = this.router.getCurrentNavigation().extras.state.dataEmpleado;
          this.currentAction = this.router.getCurrentNavigation().extras.state.action;
          if (this.router.getCurrentNavigation().extras.state.dataExamenMedico != null) {
            this.currentBTN = 'update';
            this.currentExamenMedico = this.router.getCurrentNavigation().extras.state.dataExamenMedico;
          } else {
            this.currentBTN = 'save';
            this.currentExamenMedico = null;
          }
        }
      });
    }
    this.OnChanges();
  }

  async ngOnInit() {
    this.loading = true;
    console.log(moment().format('YYYY-MM-DD'));
    console.log(moment(new Date()).format('YYYY-MM-DD'));
    await new Promise<void>((resolve) => {
      switch (this.currentAction) {
        case 'add':
          this.loading = false;
          resolve();
          break;
        case 'update':
          if (this.currentExamenMedico != null) {
            this.dataFrom.patchValue(this.currentExamenMedico);
            this.dataFrom.patchValue({ f_examen_medico: new Date(this.currentExamenMedico['f_examen_medico'].seconds * 1000) });

            this.hombro_der = this.currentExamenMedico['exmed_hombro_der'];
            this.hombro_izq = this.currentExamenMedico['exmed_hombro_izq'];
            this.muneca_der = this.currentExamenMedico['exmed_muneca_der'];
            this.muneca_izq = this.currentExamenMedico['exmed_muneca_izq'];
            this.torax = this.currentExamenMedico['exmed_torax'];
            this.columna_cervical = this.currentExamenMedico['exmed_col_cervical'];
            this.columna_dorsal = this.currentExamenMedico['exmed_col_dorsal'];
            this.columna_lumbar = this.currentExamenMedico['exmed_col_lumbar'];

            resolve();
          }
          break;
        case 'view':
          if (this.currentExamenMedico != null) {
            this.dataFrom.patchValue(this.currentExamenMedico);
            this.dataFrom.patchValue({ f_examen_medico: new Date(this.currentExamenMedico['f_examen_medico'].seconds * 1000) });
            this.dataFrom.disable({ onlySelf: true, });

            this.hombro_der = this.currentExamenMedico['exmed_hombro_der'];
            this.hombro_izq = this.currentExamenMedico['exmed_hombro_izq'];
            this.muneca_der = this.currentExamenMedico['exmed_muneca_der'];
            this.muneca_izq = this.currentExamenMedico['exmed_muneca_izq'];
            this.torax = this.currentExamenMedico['exmed_torax'];
            this.columna_cervical = this.currentExamenMedico['exmed_col_cervical'];
            this.columna_dorsal = this.currentExamenMedico['exmed_col_dorsal'];
            this.columna_lumbar = this.currentExamenMedico['exmed_col_lumbar'];

            resolve();
          }
          break;
      }
    });
  }

  createFormGrup_dataform() {

    return new FormGroup({
      f_examen_medico: new FormControl('', [Validators.required]),
      tipo_examen_medico: new FormControl('', [Validators.required]),

      exmed_bh: new FormControl('', [Validators.required]),
      exmed_plipidos: new FormControl('', [Validators.required]),

      /* *************************************************************************************************** */

      exmed_CREATIN_FOSFOKINASA: new FormControl(''),
      exmed_DESHIDROGENASA_LACTICA: new FormControl(''),
      exmed_ALBUMINA: new FormControl(''),
      exmed_CREATININA: new FormControl(''),

      exmed_UREA: new FormControl(''),
      exmed_CALCIO: new FormControl(''),
      exmed_FOSFORO: new FormControl(''),
      exmed_MAGNESIO: new FormControl(''),

      exmed_SODIO: new FormControl(''),
      exmed_POTASIO: new FormControl(''),
      exmed_CLORO: new FormControl(''),
      exmed_PROTEINAS_TOTALES: new FormControl(''),

      exmed_NITROGENO_UREICO: new FormControl(''),
      exmed_FILTRADO_GLOMERULAR: new FormControl(''),
      exmed_GLOBULINA_SERICA: new FormControl(''),
      exmed_GLOBULINAS: new FormControl(''),

      exmed_BILIRRUBINA_TOTAL: new FormControl(''),
      exmed_FOSFATASA_ALCALINA: new FormControl(''),
      exmed_ALANINO_AMINO_TRANSFERASA: new FormControl(''),
      exmed_ASPARTATO_AMINO_TRANSFERASA: new FormControl(''),

      exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA: new FormControl(''),
      exmed_BILIRRUBINA_DIRECTA: new FormControl(''),
      exmed_BILIRRUBINA_INDIRECTA: new FormControl(''),
      exmed_COLESTEROL_ALTA_DENSIDAD: new FormControl(''),

      exmed_COLESTEROL_BAJA_DENSIDAD: new FormControl(''),
      exmed_COLESTEROL_TOTAL: new FormControl(''),
      exmed_TRIGLICERIDOS: new FormControl(''),
      exmed_FOSFOLIPIDOS: new FormControl(''),

      exmed_LIPIDOS_TOTALES: new FormControl(''),
      exmed_HIERRO_SERICO: new FormControl(''),
      exmed_INDICE_SATURACION: new FormControl(''),
      exmed_UIBC: new FormControl(''),

      exmed_Capacidad_fijacion_hierro: new FormControl(''),
      exmed_FERRITINA: new FormControl(''),
      exmed_TRANSFERRINA: new FormControl(''),
      exmed_GLUCOSA: new FormControl(''),

      exmed_INSULINA_BASAL: new FormControl(''),
      exmed_OSMORALIDAD_SUERO: new FormControl(''),
      exmed_AMILASA: new FormControl(''),
      exmed_LIPASA: new FormControl(''),

      exmed_TriyodotironinaTotalT3: new FormControl(''),
      exmed_TiroxinaT4: new FormControl(''),
      exmed_TSH: new FormControl(''),
      exmed_FACTOR_REUMATOIDE_CUANTITATIVO: new FormControl(''),

      exmed_ANTI_ESTREPTO_LICINAS: new FormControl(''),
      exmed_PROTEINA_C: new FormControl(''),
      exmed_ACIDO_URICO: new FormControl(''),

      /* *************************************************************************************************** */

      exmed_CREATIN_FOSFOKINASA_valor: new FormControl({ value: '', disabled: true }),
      exmed_DESHIDROGENASA_LACTICA_valor: new FormControl({ value: '', disabled: true }),
      exmed_ALBUMINA_valor: new FormControl({ value: '', disabled: true }),
      exmed_CREATININA_valor: new FormControl({ value: '', disabled: true }),

      exmed_UREA_valor: new FormControl({ value: '', disabled: true }),
      exmed_CALCIO_valor: new FormControl({ value: '', disabled: true }),
      exmed_FOSFORO_valor: new FormControl({ value: '', disabled: true }),
      exmed_MAGNESIO_valor: new FormControl({ value: '', disabled: true }),

      exmed_SODIO_valor: new FormControl({ value: '', disabled: true }),
      exmed_POTASIO_valor: new FormControl({ value: '', disabled: true }),
      exmed_CLORO_valor: new FormControl({ value: '', disabled: true }),
      exmed_PROTEINAS_TOTALES_valor: new FormControl({ value: '', disabled: true }),

      exmed_NITROGENO_UREICO_valor: new FormControl({ value: '', disabled: true }),
      exmed_FILTRADO_GLOMERULAR_valor: new FormControl({ value: '', disabled: true }),
      exmed_GLOBULINA_SERICA_valor: new FormControl({ value: '', disabled: true }),
      exmed_GLOBULINAS_valor: new FormControl({ value: '', disabled: true }),

      exmed_BILIRRUBINA_TOTAL_valor: new FormControl({ value: '', disabled: true }),
      exmed_FOSFATASA_ALCALINA_valor: new FormControl({ value: '', disabled: true }),
      exmed_ALANINO_AMINO_TRANSFERASA_valor: new FormControl({ value: '', disabled: true }),
      exmed_ASPARTATO_AMINO_TRANSFERASA_valor: new FormControl({ value: '', disabled: true }),

      exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor: new FormControl({ value: '', disabled: true }),
      exmed_BILIRRUBINA_DIRECTA_valor: new FormControl({ value: '', disabled: true }),
      exmed_BILIRRUBINA_INDIRECTA_valor: new FormControl({ value: '', disabled: true }),
      exmed_COLESTEROL_ALTA_DENSIDAD_valor: new FormControl({ value: '', disabled: true }),

      exmed_COLESTEROL_BAJA_DENSIDAD_valor: new FormControl({ value: '', disabled: true }),
      exmed_COLESTEROL_TOTAL_valor: new FormControl({ value: '', disabled: true }),
      exmed_TRIGLICERIDOS_valor: new FormControl({ value: '', disabled: true }),
      exmed_FOSFOLIPIDOS_valor: new FormControl({ value: '', disabled: true }),

      exmed_LIPIDOS_TOTALES_valor: new FormControl({ value: '', disabled: true }),
      exmed_HIERRO_SERICO_valor: new FormControl({ value: '', disabled: true }),
      exmed_INDICE_SATURACION_valor: new FormControl({ value: '', disabled: true }),
      exmed_UIBC_valor: new FormControl({ value: '', disabled: true }),

      exmed_Capacidad_fijacion_hierro_valor: new FormControl({ value: '', disabled: true }),
      exmed_FERRITINA_valor: new FormControl({ value: '', disabled: true }),
      exmed_TRANSFERRINA_valor: new FormControl({ value: '', disabled: true }),
      exmed_GLUCOSA_valor: new FormControl({ value: '', disabled: true }),

      exmed_INSULINA_BASAL_valor: new FormControl({ value: '', disabled: true }),
      exmed_OSMORALIDAD_SUERO_valor: new FormControl({ value: '', disabled: true }),
      exmed_AMILASA_valor: new FormControl({ value: '', disabled: true }),
      exmed_LIPASA_valor: new FormControl({ value: '', disabled: true }),

      exmed_TriyodotironinaTotalT3_valor: new FormControl({ value: '', disabled: true }),
      exmed_TiroxinaT4_valor: new FormControl({ value: '', disabled: true }),
      exmed_TSH_valor: new FormControl({ value: '', disabled: true }),
      exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor: new FormControl({ value: '', disabled: true }),

      exmed_ANTI_ESTREPTO_LICINAS_valor: new FormControl({ value: '', disabled: true }),
      exmed_PROTEINA_C_valor: new FormControl({ value: '', disabled: true }),
      exmed_ACIDO_URICO_valor: new FormControl({ value: '', disabled: true }),

      /* *************************************************************************************************** */
      exmed_hombro_der: new FormControl([], [Validators.required]),
      exmed_hombro_izq: new FormControl([], [Validators.required]),
      exmed_torax: new FormControl([], [Validators.required]),
      exmed_muneca_der: new FormControl([], [Validators.required]),
      exmed_muneca_izq: new FormControl([], [Validators.required]),
      exmed_col_cervical: new FormControl([], [Validators.required]),
      exmed_otros_col_cervical: new FormControl({ value: '', disabled: true }),
      exmed_col_dorsal: new FormControl([], [Validators.required]),
      exmed_otros_col_dorsal: new FormControl({ value: '', disabled: true }),
      exmed_col_lumbar: new FormControl([], [Validators.required]),
      exmed_otros_col_lumbar: new FormControl({ value: '', disabled: true }),

      /* ************************************************************************************************** */
      exmed_espiro: new FormControl('', [Validators.required]),
      exmed_espiro_fev1: new FormControl('', [Validators.required]),
      exmed_espiro_fvc: new FormControl('', [Validators.required]),
      exmed_espiro_relacion: new FormControl('', [Validators.required]),

      exmed_espiro2_aplica: new FormControl('', [Validators.required]),
      exmed_espiro2: new FormControl({ value: '', disabled: true }),
      exmed_espiro2_fev1: new FormControl({ value: '', disabled: true }),
      exmed_espiro2_fvc: new FormControl({ value: '', disabled: true }),
      exmed_espiro2_relacion: new FormControl({ value: '', disabled: true }),

      /* *************************************************************************************************** */
      exmed_audio_OD: new FormControl('', [Validators.required]),
      exmed_audio_OI: new FormControl('', [Validators.required]),

      /* *************************************************************************************************** */
      exmed_vision_cercana: new FormControl('', [Validators.required]),
      exmed_vision_lejana: new FormControl('', [Validators.required]),
      exmed_lentes: new FormControl('', [Validators.required]),
      exmed_daltonismo: new FormControl('', [Validators.required]),

      exmed_ego: new FormControl('', [Validators.required]),

      /* *************************************************************************************************** */
      //exmed_antidoping: new FormControl('', [Validators.required]),
      //exmed_antidoping_valor: new FormControl('', [Validators.required]),
      exmed_anti_tipo: new FormControl('', [Validators.required]),

      /* *************************************************************************************************** */

      exmed_ultrasonido: new FormControl('', [Validators.required]),
      exmed_ultson_muneca_der: new FormControl({ value: '', disabled: true }),
      exmed_ultson_muneca_izq: new FormControl({ value: '', disabled: true }),
      
      /* *************************************************************************************************** */
      exmed_anti_meta: new FormControl(false),
      exmed_anti_afetaminas: new FormControl(false),
      exmed_anti_barbituricos: new FormControl(false),
      exmed_anti_cocaina: new FormControl(false),
      exmed_anti_canabinoide: new FormControl(false),
      exmed_anti_benzodiacepina: new FormControl(false),
      exmed_anti_opiaceos: new FormControl(false),
      exmed_anti_alcoholSangre: new FormControl(false),

      exmed_anti_meta_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_afetaminas_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_barbituricos_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_cocaina_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_canabinoide_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_benzodiacepina_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_opiaceos_res: new FormControl({ value: '', disabled: true }),
      exmed_anti_alcoholSangre_res: new FormControl({ value: '', disabled: true }),

    });
  }

  get df() { return this.dataFrom.controls; }

  OnChanges() {
    this.dataFrom.get("exmed_CREATIN_FOSFOKINASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_CREATIN_FOSFOKINASA_valor.setValidators([Validators.required]);
        this.df.exmed_CREATIN_FOSFOKINASA_valor.enable();
      } else {
        this.df.exmed_CREATIN_FOSFOKINASA_valor.clearValidators();
        this.df.exmed_CREATIN_FOSFOKINASA_valor.disable();
        this.df.exmed_CREATIN_FOSFOKINASA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_DESHIDROGENASA_LACTICA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_DESHIDROGENASA_LACTICA_valor.setValidators([Validators.required]);
        this.df.exmed_DESHIDROGENASA_LACTICA_valor.enable();
      } else {
        this.df.exmed_DESHIDROGENASA_LACTICA_valor.clearValidators();
        this.df.exmed_DESHIDROGENASA_LACTICA_valor.disable();
        this.df.exmed_DESHIDROGENASA_LACTICA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_ALBUMINA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_ALBUMINA_valor.setValidators([Validators.required]);
        this.df.exmed_ALBUMINA_valor.enable();
      } else {
        this.df.exmed_ALBUMINA_valor.clearValidators();
        this.df.exmed_ALBUMINA_valor.disable();
        this.df.exmed_ALBUMINA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_CREATININA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_CREATININA_valor.setValidators([Validators.required]);
        this.df.exmed_CREATININA_valor.enable();
      } else {
        this.df.exmed_CREATININA_valor.clearValidators();
        this.df.exmed_CREATININA_valor.disable();
        this.df.exmed_CREATININA_valor.reset();
      }
    })

    this.dataFrom.get("exmed_UREA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_UREA_valor.setValidators([Validators.required]);
        this.df.exmed_UREA_valor.enable();
      } else {
        this.df.exmed_UREA_valor.clearValidators();
        this.df.exmed_UREA_valor.disable();
        this.df.exmed_UREA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_CALCIO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_CALCIO_valor.setValidators([Validators.required]);
        this.df.exmed_CALCIO_valor.enable();
      } else {
        this.df.exmed_CALCIO_valor.clearValidators();
        this.df.exmed_CALCIO_valor.disable();
        this.df.exmed_CALCIO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FOSFORO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FOSFORO_valor.setValidators([Validators.required]);
        this.df.exmed_FOSFORO_valor.enable();
      } else {
        this.df.exmed_FOSFORO_valor.clearValidators();
        this.df.exmed_FOSFORO_valor.disable();
        this.df.exmed_FOSFORO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_MAGNESIO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_MAGNESIO_valor.setValidators([Validators.required]);
        this.df.exmed_MAGNESIO_valor.enable();
      } else {
        this.df.exmed_MAGNESIO_valor.clearValidators();
        this.df.exmed_MAGNESIO_valor.disable();
        this.df.exmed_MAGNESIO_valor.reset();
      }
    })

    this.dataFrom.get("exmed_SODIO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_SODIO_valor.setValidators([Validators.required]);
        this.df.exmed_SODIO_valor.enable();
      } else {
        this.df.exmed_SODIO_valor.clearValidators();
        this.df.exmed_SODIO_valor.disable();
        this.df.exmed_SODIO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_POTASIO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_POTASIO_valor.setValidators([Validators.required]);
        this.df.exmed_POTASIO_valor.enable();
      } else {
        this.df.exmed_POTASIO_valor.clearValidators();
        this.df.exmed_POTASIO_valor.disable();
        this.df.exmed_POTASIO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_CLORO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_CLORO_valor.setValidators([Validators.required]);
        this.df.exmed_CLORO_valor.enable();
      } else {
        this.df.exmed_CLORO_valor.clearValidators();
        this.df.exmed_CLORO_valor.disable();
        this.df.exmed_CLORO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_PROTEINAS_TOTALES").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_PROTEINAS_TOTALES_valor.setValidators([Validators.required]);
        this.df.exmed_PROTEINAS_TOTALES_valor.enable();
      } else {
        this.df.exmed_PROTEINAS_TOTALES_valor.clearValidators();
        this.df.exmed_PROTEINAS_TOTALES_valor.disable();
        this.df.exmed_PROTEINAS_TOTALES_valor.reset();
      }
    })

    this.dataFrom.get("exmed_NITROGENO_UREICO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_NITROGENO_UREICO_valor.setValidators([Validators.required]);
        this.df.exmed_NITROGENO_UREICO_valor.enable();
      } else {
        this.df.exmed_NITROGENO_UREICO_valor.clearValidators();
        this.df.exmed_NITROGENO_UREICO_valor.disable();
        this.df.exmed_NITROGENO_UREICO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FILTRADO_GLOMERULAR").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FILTRADO_GLOMERULAR_valor.setValidators([Validators.required]);
        this.df.exmed_FILTRADO_GLOMERULAR_valor.enable();
      } else {
        this.df.exmed_FILTRADO_GLOMERULAR_valor.clearValidators();
        this.df.exmed_FILTRADO_GLOMERULAR_valor.disable();
        this.df.exmed_FILTRADO_GLOMERULAR_valor.reset();
      }
    })
    this.dataFrom.get("exmed_GLOBULINA_SERICA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_GLOBULINA_SERICA_valor.setValidators([Validators.required]);
        this.df.exmed_GLOBULINA_SERICA_valor.enable();
      } else {
        this.df.exmed_GLOBULINA_SERICA_valor.clearValidators();
        this.df.exmed_GLOBULINA_SERICA_valor.disable();
        this.df.exmed_GLOBULINA_SERICA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_GLOBULINAS").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_GLOBULINAS_valor.setValidators([Validators.required]);
        this.df.exmed_GLOBULINAS_valor.enable();
      } else {
        this.df.exmed_GLOBULINAS_valor.clearValidators();
        this.df.exmed_GLOBULINAS_valor.disable();
        this.df.exmed_GLOBULINAS_valor.reset();
      }
    })

    this.dataFrom.get("exmed_BILIRRUBINA_TOTAL").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_BILIRRUBINA_TOTAL_valor.setValidators([Validators.required]);
        this.df.exmed_BILIRRUBINA_TOTAL_valor.enable();
      } else {
        this.df.exmed_BILIRRUBINA_TOTAL_valor.clearValidators();
        this.df.exmed_BILIRRUBINA_TOTAL_valor.disable();
        this.df.exmed_BILIRRUBINA_TOTAL_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FOSFATASA_ALCALINA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FOSFATASA_ALCALINA_valor.setValidators([Validators.required]);
        this.df.exmed_FOSFATASA_ALCALINA_valor.enable();
      } else {
        this.df.exmed_FOSFATASA_ALCALINA_valor.clearValidators();
        this.df.exmed_FOSFATASA_ALCALINA_valor.disable();
        this.df.exmed_FOSFATASA_ALCALINA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_ALANINO_AMINO_TRANSFERASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_ALANINO_AMINO_TRANSFERASA_valor.setValidators([Validators.required]);
        this.df.exmed_ALANINO_AMINO_TRANSFERASA_valor.enable();
      } else {
        this.df.exmed_ALANINO_AMINO_TRANSFERASA_valor.clearValidators();
        this.df.exmed_ALANINO_AMINO_TRANSFERASA_valor.disable();
        this.df.exmed_ALANINO_AMINO_TRANSFERASA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_ASPARTATO_AMINO_TRANSFERASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_ASPARTATO_AMINO_TRANSFERASA_valor.setValidators([Validators.required]);
        this.df.exmed_ASPARTATO_AMINO_TRANSFERASA_valor.enable();
      } else {
        this.df.exmed_ASPARTATO_AMINO_TRANSFERASA_valor.clearValidators();
        this.df.exmed_ASPARTATO_AMINO_TRANSFERASA_valor.disable();
        this.df.exmed_ASPARTATO_AMINO_TRANSFERASA_valor.reset();
      }
    })

    this.dataFrom.get("exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor.setValidators([Validators.required]);
        this.df.exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor.enable();
      } else {
        this.df.exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor.clearValidators();
        this.df.exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor.disable();
        this.df.exmed_GAMA_GLUTAMIL_TRANSPEPTIDASA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_BILIRRUBINA_DIRECTA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_BILIRRUBINA_DIRECTA_valor.setValidators([Validators.required]);
        this.df.exmed_BILIRRUBINA_DIRECTA_valor.enable();
      } else {
        this.df.exmed_BILIRRUBINA_DIRECTA_valor.clearValidators();
        this.df.exmed_BILIRRUBINA_DIRECTA_valor.disable();
        this.df.exmed_BILIRRUBINA_DIRECTA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_BILIRRUBINA_INDIRECTA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_BILIRRUBINA_INDIRECTA_valor.setValidators([Validators.required]);
        this.df.exmed_BILIRRUBINA_INDIRECTA_valor.enable();
      } else {
        this.df.exmed_BILIRRUBINA_INDIRECTA_valor.clearValidators();
        this.df.exmed_BILIRRUBINA_INDIRECTA_valor.disable();
        this.df.exmed_BILIRRUBINA_INDIRECTA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_COLESTEROL_ALTA_DENSIDAD").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_COLESTEROL_ALTA_DENSIDAD_valor.setValidators([Validators.required]);
        this.df.exmed_COLESTEROL_ALTA_DENSIDAD_valor.enable();
      } else {
        this.df.exmed_COLESTEROL_ALTA_DENSIDAD_valor.clearValidators();
        this.df.exmed_COLESTEROL_ALTA_DENSIDAD_valor.disable();
        this.df.exmed_COLESTEROL_ALTA_DENSIDAD_valor.reset();
      }
    })

    this.dataFrom.get("exmed_COLESTEROL_BAJA_DENSIDAD").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_COLESTEROL_BAJA_DENSIDAD_valor.setValidators([Validators.required]);
        this.df.exmed_COLESTEROL_BAJA_DENSIDAD_valor.enable();
      } else {
        this.df.exmed_COLESTEROL_BAJA_DENSIDAD_valor.clearValidators();
        this.df.exmed_COLESTEROL_BAJA_DENSIDAD_valor.disable();
        this.df.exmed_COLESTEROL_BAJA_DENSIDAD_valor.reset();
      }
    })
    this.dataFrom.get("exmed_COLESTEROL_TOTAL").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_COLESTEROL_TOTAL_valor.setValidators([Validators.required]);
        this.df.exmed_COLESTEROL_TOTAL_valor.enable();
      } else {
        this.df.exmed_COLESTEROL_TOTAL_valor.clearValidators();
        this.df.exmed_COLESTEROL_TOTAL_valor.disable();
        this.df.exmed_COLESTEROL_TOTAL_valor.reset();
      }
    })
    this.dataFrom.get("exmed_TRIGLICERIDOS").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_TRIGLICERIDOS_valor.setValidators([Validators.required]);
        this.df.exmed_TRIGLICERIDOS_valor.enable();
      } else {
        this.df.exmed_TRIGLICERIDOS_valor.clearValidators();
        this.df.exmed_TRIGLICERIDOS_valor.disable();
        this.df.exmed_TRIGLICERIDOS_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FOSFOLIPIDOS").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FOSFOLIPIDOS_valor.setValidators([Validators.required]);
        this.df.exmed_FOSFOLIPIDOS_valor.enable();
      } else {
        this.df.exmed_FOSFOLIPIDOS_valor.clearValidators();
        this.df.exmed_FOSFOLIPIDOS_valor.disable();
        this.df.exmed_FOSFOLIPIDOS_valor.reset();
      }
    })

    this.dataFrom.get("exmed_LIPIDOS_TOTALES").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_LIPIDOS_TOTALES_valor.setValidators([Validators.required]);
        this.df.exmed_LIPIDOS_TOTALES_valor.enable();
      } else {
        this.df.exmed_LIPIDOS_TOTALES_valor.clearValidators();
        this.df.exmed_LIPIDOS_TOTALES_valor.disable();
        this.df.exmed_LIPIDOS_TOTALES_valor.reset();
      }
    })
    this.dataFrom.get("exmed_HIERRO_SERICO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_HIERRO_SERICO_valor.setValidators([Validators.required]);
        this.df.exmed_HIERRO_SERICO_valor.enable();
      } else {
        this.df.exmed_HIERRO_SERICO_valor.clearValidators();
        this.df.exmed_HIERRO_SERICO_valor.disable();
        this.df.exmed_HIERRO_SERICO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_INDICE_SATURACION").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_INDICE_SATURACION_valor.setValidators([Validators.required]);
        this.df.exmed_INDICE_SATURACION_valor.enable();
      } else {
        this.df.exmed_INDICE_SATURACION_valor.clearValidators();
        this.df.exmed_INDICE_SATURACION_valor.disable();
        this.df.exmed_INDICE_SATURACION_valor.reset();
      }
    })
    this.dataFrom.get("exmed_UIBC").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_UIBC_valor.setValidators([Validators.required]);
        this.df.exmed_UIBC_valor.enable();
      } else {
        this.df.exmed_UIBC_valor.clearValidators();
        this.df.exmed_UIBC_valor.disable();
        this.df.exmed_UIBC_valor.reset();
      }
    })

    this.dataFrom.get("exmed_Capacidad_fijacion_hierro").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_Capacidad_fijacion_hierro_valor.setValidators([Validators.required]);
        this.df.exmed_Capacidad_fijacion_hierro_valor.enable();
      } else {
        this.df.exmed_Capacidad_fijacion_hierro_valor.clearValidators();
        this.df.exmed_Capacidad_fijacion_hierro_valor.disable();
        this.df.exmed_Capacidad_fijacion_hierro_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FERRITINA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FERRITINA_valor.setValidators([Validators.required]);
        this.df.exmed_FERRITINA_valor.enable();
      } else {
        this.df.exmed_FERRITINA_valor.clearValidators();
        this.df.exmed_FERRITINA_valor.disable();
        this.df.exmed_FERRITINA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_TRANSFERRINA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_TRANSFERRINA_valor.setValidators([Validators.required]);
        this.df.exmed_TRANSFERRINA_valor.enable();
      } else {
        this.df.exmed_TRANSFERRINA_valor.clearValidators();
        this.df.exmed_TRANSFERRINA_valor.disable();
        this.df.exmed_TRANSFERRINA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_GLUCOSA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_GLUCOSA_valor.setValidators([Validators.required]);
        this.df.exmed_GLUCOSA_valor.enable();
      } else {
        this.df.exmed_GLUCOSA_valor.clearValidators();
        this.df.exmed_GLUCOSA_valor.disable();
        this.df.exmed_GLUCOSA_valor.reset();
      }
    })

    this.dataFrom.get("exmed_INSULINA_BASAL").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_INSULINA_BASAL_valor.setValidators([Validators.required]);
        this.df.exmed_INSULINA_BASAL_valor.enable();
      } else {
        this.df.exmed_INSULINA_BASAL_valor.clearValidators();
        this.df.exmed_INSULINA_BASAL_valor.disable();
        this.df.exmed_INSULINA_BASAL_valor.reset();
      }
    })
    this.dataFrom.get("exmed_OSMORALIDAD_SUERO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_OSMORALIDAD_SUERO_valor.setValidators([Validators.required]);
        this.df.exmed_OSMORALIDAD_SUERO_valor.enable();
      } else {
        this.df.exmed_OSMORALIDAD_SUERO_valor.clearValidators();
        this.df.exmed_OSMORALIDAD_SUERO_valor.disable();
        this.df.exmed_OSMORALIDAD_SUERO_valor.reset();
      }
    })
    this.dataFrom.get("exmed_AMILASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_AMILASA_valor.setValidators([Validators.required]);
        this.df.exmed_AMILASA_valor.enable();
      } else {
        this.df.exmed_AMILASA_valor.clearValidators();
        this.df.exmed_AMILASA_valor.disable();
        this.df.exmed_AMILASA_valor.reset();
      }
    })
    this.dataFrom.get("exmed_LIPASA").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_LIPASA_valor.setValidators([Validators.required]);
        this.df.exmed_LIPASA_valor.enable();
      } else {
        this.df.exmed_LIPASA_valor.clearValidators();
        this.df.exmed_LIPASA_valor.disable();
        this.df.exmed_LIPASA_valor.reset();
      }
    })

    this.dataFrom.get("exmed_TriyodotironinaTotalT3").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_TriyodotironinaTotalT3_valor.setValidators([Validators.required]);
        this.df.exmed_TriyodotironinaTotalT3_valor.enable();
      } else {
        this.df.exmed_TriyodotironinaTotalT3_valor.clearValidators();
        this.df.exmed_TriyodotironinaTotalT3_valor.disable();
        this.df.exmed_TriyodotironinaTotalT3_valor.reset();
      }
    })
    this.dataFrom.get("exmed_TiroxinaT4").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_TiroxinaT4_valor.setValidators([Validators.required]);
        this.df.exmed_TiroxinaT4_valor.enable();
      } else {
        this.df.exmed_TiroxinaT4_valor.clearValidators();
        this.df.exmed_TiroxinaT4_valor.disable();
        this.df.exmed_TiroxinaT4_valor.reset();
      }
    })
    this.dataFrom.get("exmed_TSH").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_TSH_valor.setValidators([Validators.required]);
        this.df.exmed_TSH_valor.enable();
      } else {
        this.df.exmed_TSH_valor.clearValidators();
        this.df.exmed_TSH_valor.disable();
        this.df.exmed_TSH_valor.reset();
      }
    })
    this.dataFrom.get("exmed_FACTOR_REUMATOIDE_CUANTITATIVO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor.setValidators([Validators.required]);
        this.df.exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor.enable();
      } else {
        this.df.exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor.clearValidators();
        this.df.exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor.disable();
        this.df.exmed_FACTOR_REUMATOIDE_CUANTITATIVO_valor.reset();
      }
    })

    this.dataFrom.get("exmed_ANTI_ESTREPTO_LICINAS").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_ANTI_ESTREPTO_LICINAS_valor.setValidators([Validators.required]);
        this.df.exmed_ANTI_ESTREPTO_LICINAS_valor.enable();
      } else {
        this.df.exmed_ANTI_ESTREPTO_LICINAS_valor.clearValidators();
        this.df.exmed_ANTI_ESTREPTO_LICINAS_valor.disable();
        this.df.exmed_ANTI_ESTREPTO_LICINAS_valor.reset();
      }
    })
    this.dataFrom.get("exmed_PROTEINA_C").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_PROTEINA_C_valor.setValidators([Validators.required]);
        this.df.exmed_PROTEINA_C_valor.enable();
      } else {
        this.df.exmed_PROTEINA_C_valor.clearValidators();
        this.df.exmed_PROTEINA_C_valor.disable();
        this.df.exmed_PROTEINA_C_valor.reset();
      }
    })
    this.dataFrom.get("exmed_ACIDO_URICO").valueChanges.subscribe(val => {
      if (val == "si") {
        this.df.exmed_ACIDO_URICO_valor.setValidators([Validators.required]);
        this.df.exmed_ACIDO_URICO_valor.enable();
      } else {
        this.df.exmed_ACIDO_URICO_valor.clearValidators();
        this.df.exmed_ACIDO_URICO_valor.disable();
        this.df.exmed_ACIDO_URICO_valor.reset();
      }
    })

   /*  this.dataFrom.get("exmed_antidoping").valueChanges.subscribe(val => {
      if (val == "POSITIVO") {
        this.df.exmed_antidoping_valor.setValidators([Validators.required]);
        this.df.exmed_antidoping_valor.enable();
      } else {
        this.df.exmed_antidoping_valor.clearValidators();
        this.df.exmed_antidoping_valor.disable();
        this.df.exmed_antidoping_valor.reset();
      }
    }) */

    this.dataFrom.get("exmed_espiro2_aplica").valueChanges.subscribe(val => {
      if (val == "Si") {
        this.df.exmed_espiro2.setValidators([Validators.required]);
        this.df.exmed_espiro2.enable();
        this.df.exmed_espiro2_fev1.setValidators([Validators.required]);
        this.df.exmed_espiro2_fev1.enable();
        this.df.exmed_espiro2_fvc.setValidators([Validators.required]);
        this.df.exmed_espiro2_fvc.enable();
        this.df.exmed_espiro2_relacion.setValidators([Validators.required]);
        this.df.exmed_espiro2_relacion.enable();
      } else {
        this.df.exmed_espiro2.clearValidators();
        this.df.exmed_espiro2.disable();
        this.df.exmed_espiro2.reset();
        this.df.exmed_espiro2_fev1.clearValidators();
        this.df.exmed_espiro2_fev1.disable();
        this.df.exmed_espiro2_fev1.reset();
        this.df.exmed_espiro2_fvc.clearValidators();
        this.df.exmed_espiro2_fvc.disable();
        this.df.exmed_espiro2_fvc.reset();
        this.df.exmed_espiro2_relacion.clearValidators();
        this.df.exmed_espiro2_relacion.disable();
        this.df.exmed_espiro2_relacion.reset();
      }
    })

    this.dataFrom.get("exmed_anti_tipo").valueChanges.subscribe(val => {
      if (val == "No aplica") {
        this.df.exmed_anti_meta.clearValidators();
        this.df.exmed_anti_meta.disable();
        this.df.exmed_anti_meta.reset()
        this.df.exmed_anti_afetaminas.clearValidators();
        this.df.exmed_anti_afetaminas.disable();
        this.df.exmed_anti_afetaminas.reset()
        this.df.exmed_anti_barbituricos.clearValidators();
        this.df.exmed_anti_barbituricos.disable();
        this.df.exmed_anti_barbituricos.reset()
        this.df.exmed_anti_cocaina.clearValidators();
        this.df.exmed_anti_cocaina.disable();
        this.df.exmed_anti_cocaina.reset()
        this.df.exmed_anti_canabinoide.clearValidators();
        this.df.exmed_anti_canabinoide.disable();
        this.df.exmed_anti_canabinoide.reset()
        this.df.exmed_anti_benzodiacepina.clearValidators();
        this.df.exmed_anti_benzodiacepina.disable();
        this.df.exmed_anti_benzodiacepina.reset()
        this.df.exmed_anti_opiaceos.clearValidators();
        this.df.exmed_anti_opiaceos.disable();
        this.df.exmed_anti_opiaceos.reset()
        this.df.exmed_anti_alcoholSangre.clearValidators();
        this.df.exmed_anti_alcoholSangre.disable();
        this.df.exmed_anti_alcoholSangre.reset()
      } else { 
        //this.df.exmed_anti_meta.setValidators([Validators.required]);
        this.df.exmed_anti_meta.enable();
        //this.df.exmed_anti_afetaminas.setValidators([Validators.required]);
        this.df.exmed_anti_afetaminas.enable();
        //this.df.exmed_anti_barbituricos.setValidators([Validators.required]);
        this.df.exmed_anti_barbituricos.enable();
        //this.df.exmed_anti_cocaina.setValidators([Validators.required]);
        this.df.exmed_anti_cocaina.enable();
        //this.df.exmed_anti_canabinoide.setValidators([Validators.required]);
        this.df.exmed_anti_canabinoide.enable();
        //this.df.exmed_anti_benzodiacepina.setValidators([Validators.required]);
        this.df.exmed_anti_benzodiacepina.enable();
        //this.df.exmed_anti_opiaceos.setValidators([Validators.required]);
        this.df.exmed_anti_opiaceos.enable();
        //this.df.exmed_anti_alcoholSangre.setValidators([Validators.required]);
        this.df.exmed_anti_alcoholSangre.enable();

      }
    })

    this.dataFrom.get("exmed_anti_meta").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_meta_res.setValidators([Validators.required]);
        this.df.exmed_anti_meta_res.enable();
      } else {
        this.df.exmed_anti_meta_res.clearValidators();
        this.df.exmed_anti_meta_res.disable();
        this.df.exmed_anti_meta_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_afetaminas").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_afetaminas_res.setValidators([Validators.required]);
        this.df.exmed_anti_afetaminas_res.enable();
      } else {
        this.df.exmed_anti_afetaminas_res.clearValidators();
        this.df.exmed_anti_afetaminas_res.disable();
        this.df.exmed_anti_afetaminas_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_barbituricos").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_barbituricos_res.setValidators([Validators.required]);
        this.df.exmed_anti_barbituricos_res.enable();
      } else {
        this.df.exmed_anti_barbituricos_res.clearValidators();
        this.df.exmed_anti_barbituricos_res.disable();
        this.df.exmed_anti_barbituricos_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_cocaina").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_cocaina_res.setValidators([Validators.required]);
        this.df.exmed_anti_cocaina_res.enable();
      } else {
        this.df.exmed_anti_cocaina_res.clearValidators();
        this.df.exmed_anti_cocaina_res.disable();
        this.df.exmed_anti_cocaina_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_canabinoide").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_canabinoide_res.setValidators([Validators.required]);
        this.df.exmed_anti_canabinoide_res.enable();
      } else {
        this.df.exmed_anti_canabinoide_res.clearValidators();
        this.df.exmed_anti_canabinoide_res.disable();
        this.df.exmed_anti_canabinoide_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_benzodiacepina").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_benzodiacepina_res.setValidators([Validators.required]);
        this.df.exmed_anti_benzodiacepina_res.enable();
      } else {
        this.df.exmed_anti_benzodiacepina_res.clearValidators();
        this.df.exmed_anti_benzodiacepina_res.disable();
        this.df.exmed_anti_benzodiacepina_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_opiaceos").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_opiaceos_res.setValidators([Validators.required]);
        this.df.exmed_anti_opiaceos_res.enable();
      } else {
        this.df.exmed_anti_opiaceos_res.clearValidators();
        this.df.exmed_anti_opiaceos_res.disable();
        this.df.exmed_anti_opiaceos_res.reset();
      }
    })

    this.dataFrom.get("exmed_anti_alcoholSangre").valueChanges.subscribe(val => {
      if (val == true) {
        this.df.exmed_anti_alcoholSangre_res.setValidators([Validators.required]);
        this.df.exmed_anti_alcoholSangre_res.enable();
      } else {
        this.df.exmed_anti_alcoholSangre_res.clearValidators();
        this.df.exmed_anti_alcoholSangre_res.disable();
        this.df.exmed_anti_alcoholSangre_res.reset();
      }
    })

    this.dataFrom.get("exmed_col_cervical").valueChanges.subscribe(val => {
      val.forEach(element => {
        if (element == 'OTRAS') {
          this.columna_cervical_otras = true;
          this.df.exmed_otros_col_cervical.setValidators([Validators.required]);
          this.df.exmed_otros_col_cervical.enable();
        } else {
          this.columna_cervical_otras = false;
          this.df.exmed_otros_col_cervical.clearValidators();
          this.df.exmed_otros_col_cervical.disable();
          this.df.exmed_otros_col_cervical.reset();
        }
      });
    })

    this.dataFrom.get("exmed_col_dorsal").valueChanges.subscribe(val => {
      val.forEach(element => {
        if (element == 'Otras') {
          this.columna_dorsal_otras = true;
          this.df.exmed_otros_col_dorsal.setValidators([Validators.required]);
          this.df.exmed_otros_col_dorsal.enable();
        } else {
          this.columna_dorsal_otras = false;
          this.df.exmed_otros_col_dorsal.clearValidators();
          this.df.exmed_otros_col_dorsal.disable();
          this.df.exmed_otros_col_dorsal.reset();
        }
      });
    })

    this.dataFrom.get("exmed_col_lumbar").valueChanges.subscribe(val => {
      val.forEach(element => {
        if (element == 'Otras') {
          this.columna_lumbar_otras = true;
          this.df.exmed_otros_col_lumbar.setValidators([Validators.required]);
          this.df.exmed_otros_col_lumbar.enable();
        } else {
          this.columna_lumbar_otras = false;
          this.df.exmed_otros_col_lumbar.clearValidators();
          this.df.exmed_otros_col_lumbar.disable();
          this.df.exmed_otros_col_lumbar.reset();
        }
      });
    })

    this.dataFrom.get("exmed_ultrasonido").valueChanges.subscribe(val => {
      if (val == 'Si') {
        this.df.exmed_ultson_muneca_der.setValidators([Validators.required]);
        this.df.exmed_ultson_muneca_der.enable();
        this.df.exmed_ultson_muneca_izq.setValidators([Validators.required]);
        this.df.exmed_ultson_muneca_izq.enable();
      }
      else {
        this.df.exmed_ultson_muneca_der.clearValidators();
        this.df.exmed_ultson_muneca_der.disable();
        this.df.exmed_ultson_muneca_der.reset();
        this.df.exmed_ultson_muneca_izq.clearValidators();
        this.df.exmed_ultson_muneca_izq.disable();
        this.df.exmed_ultson_muneca_izq.reset();
      }
    })

  }

  onCancel() {
    this.router.navigate(['/pages/examenes-medicos']);
  }

  btnAccion(accion: string) {
    switch (accion) {
      case 'save':
        this.onSubmit();
        break;
      case 'update':
        this.onUpdate();
        break;
    }
  }

  async onSubmit() {
    this.loading = true;
    let dataExa = this.dataFrom.value;
    console.log(dataExa);
    console.log(dataExa.exmed_qs_lista);
    dataExa['DataEmpleado'] = {
      id: this.currentEmpleado.id,
      pac_nombres: this.currentEmpleado.pac_nombres,
      pac_apPrimero: this.currentEmpleado.pac_apPrimero,
      pac_apSegundo: this.currentEmpleado.pac_apSegundo,
      pac_nomina: this.currentEmpleado.pac_nomina,
      pac_imss: this.currentEmpleado.pac_imss,
      pac_fNacimiento: this.currentEmpleado.pac_fNacimiento,
      pac_sexo: this.currentEmpleado.pac_genero,
      subempresa: this.currentEmpleado.subempresa,
      ori_pac_name: this.currentEmpleado.ori_pac_name,
    };
    await new Promise<void>((resolve) => {
      this.ServiceExaMed.addExamenMedico(dataExa).then((data) => {
        this.loading = false;
        Swal.fire(
          '¡Datos Guardados!',
          'Los datos ha sido guardado correctamente',
          'success',
        ).then(() => {
          this.onCancel();
          this.dataFrom.reset();
          resolve();
        });
      }).catch((err) => {
        this.loading = false;
        console.log(err);
        resolve();
      });
    });
  }

  async onUpdate() {
    this.loading = true;
    let dataExa = this.dataFrom.value;
    await new Promise<void>((resolve) => {
      this.ServiceExaMed.updateExamenMedico(dataExa, this.currentExamenMedico.id_examen_medico).then(() => {
        this.loading = false;
        Swal.fire(
          '¡Datos Actualizado!',
          'Los datos ha sido actualizados correctamente',
          'success',
        ).then(() => {
          this.onCancel();
          this.dataFrom.reset();
          resolve();
        });
      }).catch((err) => {
        this.loading = false;
        console.log(err);
        resolve();
      });
    });
  }

}
