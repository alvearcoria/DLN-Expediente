import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../../auth/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
//import { ModaldetalleComponent } from '../modaldetalle/modaldetalle.component';
//import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { ModalIncapacidadComponent } from './../../components/modal-incapacidad/modal-incapacidad.component';
@Component({
  selector: 'dln-detalles-incapacidad',
  templateUrl: './detalles-incapacidad.component.html',
  styleUrls: ['./detalles-incapacidad.component.scss']
})
export class DetallesIncapacidadComponent implements OnInit {

  fIniciainca: string = '';
  fRegresoLaboral: string = '';
  diastotales = 0;
  estado_incapacidad: string = '';

  @Input() currentdetalle_inca: any = null;
  @Input() currentIncapacidad: any = null;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  modalRef: BsModalRef;
  public tablaConsultas: GridOptions;
  incapacidadList: any;

  columnasConsultas = [

    { width: 70, headerName: 'Folio', field: 'inca_folio' },
    {
      width: 90, headerName: 'Inicia', field: 'inca_fInicia', sort: 'asc', cellRenderer: (data) => {
        if (typeof data.value == 'undefined' || data.value == '') return '';
        else {
          let d = new Date(data.value.seconds * 1000);
          return moment(d).format('DD/MM/YYYY')
        }
      },
      filter: "agDateColumnFilter",
      filterParams: {
        browserDatePicker: true,
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          var cellDate = new Date(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    },
    {
      width: 90, headerName: 'Termina', field: 'inca_fTermina', cellRenderer: (data) => {
        if (typeof data.value == 'undefined' || data.value == '') return '';
        else {
          let d = new Date(data.value.seconds * 1000);
          return moment(d).format('DD/MM/YYYY')
        }
      },
      filter: "agDateColumnFilter",
      filterParams: {
        browserDatePicker: true,
        comparator: function (filterLocalDateAtMidnight, cellValue) {
          var cellDate = new Date(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    },
    { width: 65, headerName: 'Días', field: 'inca_dias' },
    { width: 250, headerName: 'Diagnostico', field: 'inca_diagnostico' },
    { width: 150, headerName: 'Tipo', field: 'inca_tipo' },

    {
      headerName: 'Opciones',
      children: [
        {
          width: 80,
          headerName: 'VER',
          field: 'id',
          cellRenderer: (params) => {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fas fa-user-edit mt-0">Ver</i>';
            button.classList.add('btn');
            button.classList.add('btn-sm');
            button.classList.add('btn-primary');
            button.title = 'VER';
            return button;
          },
        },
      ],
    },


  ];

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService,
    public datepipe: DatePipe,
    public router: Router,
    private modalService: BsModalService

  ) {
    console.log('Constructor');
    console.log(this.currentIncapacidad);
    this.currentIncapacidad;
    this.tablaConsultas = <GridOptions>{
      columnDefs: this.columnasConsultas,
      defaultColDef: {
        filter: true,
        sortable: true,
      },
      rowData: null,
    };
  }

  async ngOnInit() {
    console.log('Empieza onInit');
    await new Promise<void>(resolve => {
      this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('incapacidades', ref => ref.
        where('id_consulta', '==', this.currentIncapacidad.id_consulta)).valueChanges().pipe(take(1)).subscribe(consulta => {
          if (consulta.length != 0) {
            if (consulta[0].id_incapacidad) { this.currentIncapacidad = consulta[0] }
            var finicia = new Date(this.currentIncapacidad['f_inicio'].seconds * 1000);
            this.fIniciainca = moment(finicia).format('DD/MM/YYYY');
            var ftermina = new Date(this.currentIncapacidad['f_termina'].seconds * 1000);
            this.fRegresoLaboral = moment(ftermina).format('DD/MM/YYYY');
            this.diastotales = this.currentIncapacidad['dias_totales'];
            this.estado_incapacidad = this.currentIncapacidad['estatus_inca'];
            this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('detalles_incapacidad', ref => ref.
              where('id_incapacidad', '==', consulta[0].id_incapacidad)).valueChanges().pipe(take(1)).subscribe(hist_incapacidad => {
                this.incapacidadList = hist_incapacidad;
                if (!(this.tablaConsultas.api === undefined)) {
                  this.tablaConsultas.api.setRowData(this.incapacidadList);
                }
              });
            resolve();
          } else {
            Swal.fire({
              title: 'Alerta',
              // tslint:disable-next-line: max-line-length
              text: 'Esta consulta no tiene incapacidad asignada. ¿Deseas asignar una incapacidad ahora?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, añadir incapacidad.',
            }).then((result) => {
              if (result.value) {
                this.addInca();
              } else {
                this.closeModal.emit({ cerrar: true });
              }
            });
          }
        });
    }).then(() => {
      console.log('Datos cuerent inca');
      console.log(this.currentIncapacidad);
      //this.done = true;
    });
  }

  onCellClicked(params: any) {

    if (params.colDef.headerName === 'VER') {
      this.closeModal.emit({ cerrar: true });
      const initialState = {
        currentdetalle_inca: params.data,
        title_modal: 'Detalle de la incapacidad',
        modalTipo: 'ver_incapacidad',
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'gray modal-lg'
      };

      this.modalRef = this.modalService.show(ModalIncapacidadComponent, {
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'gray modal-lg', initialState
      });
    }
  }

  onGridReady(ev) { }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tablaConsultas.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tablaConsultas.api.setRowData(this.incapacidadList);
  }


  addInca() {
    this.closeModal.emit({ cerrar: true });
    const initialState = {
      currentIncapacidad: this.currentIncapacidad,
      title_modal: 'Añadir incapacidad',
      modalTipo: 'addInca',
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };

    this.modalRef = this.modalService.show(ModalIncapacidadComponent, {
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg', initialState
    });
  }

}
