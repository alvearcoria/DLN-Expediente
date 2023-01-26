import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';
import * as moment from 'moment';
import { ActionIncapacidadComponent } from './action-incapacidad/action-incapacidad.component';

@Component({
  selector: 'dln-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.scss']
})
export class IncapacidadesComponent implements OnInit, OnDestroy {

  done: boolean = false;
  incapacidadesList: any;
  currentincapacidades: any;
  incapacidad: Observable<any>;
  subscription: Subscription;
  private tablaincapacidades: GridOptions;

  columnasConsultas = [

    { width: 60, headerName: 'ITEM', field: 'idNumerico' },
    { width: 100, headerName: 'No Nomina', field: 'detalleEmpleado.pac_nomina' },
    { width: 250, headerName: 'Paciente', field: 'detalleEmpleado.fullname' },
    { width: 200, headerName: 'Tipo de incapacidad', field: 'tipo_incapacidad' },
    {
      width: 100, headerName: 'ESTATUS', field: 'estatus_inca',
      cellRenderer: (params) => {
        const label = document.createElement('label');
        switch (params.value) {
          case 'activa':
            label.innerHTML = '<h6 style = "color: #ffffff;"><span class="badge badge-primary">'
              + 'Activa ' + '<i class="fas fa-plus-square"></i>'
              + '</span></h6>'; label.title = 'Activa';
            break;
          case 'terminada':
            label.innerHTML = '<h6 style = "color: #ffffff;"><span class="badge badge-success">'
              + 'Terminado ' + '<i class="fas fa-clipboard-check"></i>'
              + '</span></h6>'; label.title = 'Terminado';
            break;
          default:
        }
        return label;
      },
    },
    {
      width: 150, headerName: 'Fecha 1ra incapacidad', field: 'f_inicio', cellRenderer: (data) => {
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
      width: 150, headerName: 'Fecha ingreso lab', field: 'f_ingreso_lab', cellRenderer: (data) => {
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
    { width: 250, headerName: 'Detalle Incapacidad', field: 'nombre_atiende' },

    {
      width: 250,
      headerName: 'Acciones componente',
      cellRendererFramework: ActionIncapacidadComponent,
      //cellRendererParams: { currentEmpleado: { ...this.dataEmpleado, idcell: this.dataEmpleado.pac_nombres } },
      pinned: 'right'
    }
  ];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {

    this.tablaincapacidades = <GridOptions>{
      columnDefs: this.columnasConsultas,
      defaultColDef: {
        filter: true,
        sortable: true,
      },
      rowData: null,
    };
  }

  async ngOnInit() {
    await new Promise<void>(resolve => {
      this.incapacidad = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos)
        .collection('incapacidades', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
      this.subscription = this.incapacidad.subscribe(inca => {
        this.incapacidadesList = inca;
        if (!(this.tablaincapacidades.api === undefined)) {
          this.tablaincapacidades.api.setRowData(this.incapacidadesList);
        }
        resolve();
      });
    }).then(() => {
      this.done = true;
    });
  }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tablaincapacidades.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tablaincapacidades.api.setRowData(this.incapacidadesList);
  }

  onQuickFilterChanged($event) {
    this.tablaincapacidades.api.setQuickFilter($event.target.value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
