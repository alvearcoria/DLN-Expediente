
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NbDateService, } from '@nebular/theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { AccionesConsultaComponent } from './acciones-consulta/acciones-consulta.component';

@Component({
  selector: 'dln-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent implements OnInit, OnDestroy{

  modalRef: BsModalRef;
  configModal = {
    keyboard: false,
    scrollable: false,
    backdrop: true,
    ignoreBackdropClick: true,
    animated: true,
    class: 'modal-lg',
  };

  done: boolean = false;
  consultasList: any;
  empleadoslist: any;
  currentConsultas: any;
  currentEmpelados: any;
  consulta: Observable<any>;
  allempleados: Observable<any>;
  subscription: Subscription;
  private tablaConsultas: GridOptions;
  private tablaEmpleados: GridOptions;

  min: Date;
  max: Date;

  userList: any;
  user: any;

  columnasConsultas = [

    { width: 70, headerName: 'ID', field: 'idNumerico' },
    { width: 200, headerName: 'Nombre del Paciente', field: 'fullname' },
    {
      width: 150, headerName: 'Fecha de consulta', field: 'f_registro', cellRenderer: (data) => {
        if (typeof data.value == 'undefined' || data.value == '') return '';
        else {
          let d = new Date(data.value.seconds * 1000);
          return moment(d).format('DD/MM/YYYY HH:mm')
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
    { width: 250, headerName: 'Quien atende', field: 'nombre_atiende' },
    {
      width: 250,
      headerName: 'Acciones componente',
      cellRendererFramework: AccionesConsultaComponent,
      //cellRendererParams: { currentEmpleado: { ...this.dataEmpleado, idcell: this.dataEmpleado.pac_nombres } },
      pinned: 'right'
    }
  ];

  columnasempleados = [

    { width: 60, headerName: 'ID', field: 'idNumerico' },
    { width: 80, headerName: 'Nomina', field: 'pac_nomina' },
    { width: 250, headerName: 'Nombre del empleado', field: 'fullname' },
    { width: 300, headerName: 'Origen empreesa', field: 'ori_pac_name' },
    {
      width: 80,
      headerName: 'USAR',
      field: 'id',
      cellRenderer: (params) => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-plus-circle"></i>';
        button.classList.add('btn');
        button.classList.add('btn-sm');
        button.classList.add('btn-success');
        button.title = '';
        return button;
      },

    },
  ];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AuthService,
    protected dateService: NbDateService<Date>,
    private modalService: BsModalService,

  ) {
    this.min = this.dateService.addMonth(this.dateService.today(), -2);
    this.max = this.dateService.today();

    this.tablaConsultas = <GridOptions>{
      columnDefs: this.columnasConsultas,
      defaultColDef: {
        filter: true,
        sortable: true,
      },
      rowData: null,
    };

    this.tablaEmpleados = <GridOptions>{
      columnDefs: this.columnasempleados,
      defaultColDef: {
        filter: true, // set filtering on for all cols
        sortable: true,
      },
      rowData: null,
      onGridReady: () => {
        const allColumnIds = [];
        this.tablaEmpleados.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column['colId']);
        });
        this.tablaEmpleados.api.setRowData(this.empleadoslist);
      }
    };
  }

  async ngOnInit() {

    await new Promise<void>(resolve => {
      this.allempleados = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos)
        .collection('empleados', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
      this.subscription = this.allempleados.subscribe(empleado => {
        this.empleadoslist = empleado;
        this.empleadoslist.map(p => {
          p['fullname'] = p.pac_nombres + ' '
            + p.pac_apPrimero + ' '
            + p.pac_apSegundo;
        });

        if (!(this.tablaEmpleados.api === undefined)) {
          this.tablaEmpleados.api.setRowData(this.empleadoslist);
        }
        resolve();
      });
    }).then(() => {
    });

    await new Promise<void>(resolve => {
      this.consulta = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos)
        .collection('consultas', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
      this.subscription = this.consulta.subscribe(consulta => {
        this.consultasList = consulta;
        this.consultasList.map(p => {
          if (this.empleadoslist.length > 0) {
            this.empleadoslist.find(x => {
              if (x.id == p.id) {
                p['fullname'] = x.pac_nombres + ' '
                  + x.pac_apPrimero + ' '
                  + x.pac_apSegundo;
                p['currentEmpleado'] = x;
              }
            });
          }
        });

        if (!(this.tablaConsultas.api === undefined)) {
          this.tablaConsultas.api.setRowData(this.consultasList);
        }
        resolve();
      });
    }).then(() => {
      this.done = true;
    });
  }

  goToaddsubempresa() {
    this.done = false;
    this.router.navigate(['/pages/addsubempresa'],
      { queryParams: {}, skipLocationChange: true });
  }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tablaConsultas.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tablaConsultas.api.setRowData(this.consultasList);
  }

  onGridReady(params: any) {

  }

  onQuickFilterChanged($event) {
    this.tablaConsultas.api.setQuickFilter($event.target.value);
  }

  onQuickFilterChanged_emp($event) {
    this.tablaEmpleados.api.setQuickFilter($event.target.value);
  }

  onCellClicked(params: any) {

    if (params.colDef.headerName === 'USAR') {
      this.router.navigate(['/pages/add-consulta'],
        { queryParams: { ...params.data, componentConsu: true }, skipLocationChange: true });
      this.cerrarModal();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async modalEmpleado(modalEmpleados: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalEmpleados, this.configModal);
  }

  cerrarModal() {
    this.modalRef.hide();
  }

}
