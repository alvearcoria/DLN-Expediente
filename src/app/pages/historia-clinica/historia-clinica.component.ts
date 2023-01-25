import { Component, OnInit, OnDestroy, TemplateRef, } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
const Swal = require('sweetalert2');
import { AuthService } from '../../auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dln-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit, OnDestroy {

  private tableClinicHistory: GridOptions;
  private tablaEmpleados: GridOptions;

  done: boolean = false;
  histroiasList: any;
  empleadoslist: any;

  allHistory: Observable<any>;
  allempleados: Observable<any>;

  subscription: Subscription;

  modalRef?: BsModalRef;

  configModal = {
    keyboard: false,
    scrollable: false,
    backdrop: true,
    ignoreBackdropClick: true,
    animated: true,
    class: 'modal-lg',
  };

  columnsHistory = [
    { width: 60, headerName: 'No', field: 'idNumerico', sort: 'asc', },
    { width: 130, headerName: 'ID/Nomina', field: 'pac_nomina' },
    { width: 250, headerName: 'Nombre(s)', field: 'fullname' },
    { width: 130, headerName: 'Ciudad', field: 'pac_ciudad' },
    {
      headerName: 'Opciones',
      pinned: 'right',
      children: [
        {
          width: 80,
          headerName: 'Editar',
          field: 'id',
          pinned: 'right',

          cellRenderer: (params) => {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fas fa-user-edit mt-0"></i>';
            button.classList.add('btn');
            button.classList.add('btn-sm');
            button.classList.add('btn-primary');
            button.title = 'Editar';
            return button;
          },
        },
        {
          width: 90,
          headerName: 'Eliminar',
          field: 'id',
          pinned: 'right',

          cellRenderer: (params) => {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fas fa-user-minus mt-0"></i>';
            button.classList.add('btn');
            button.classList.add('btn-sm');
            button.classList.add('btn-danger');
            button.title = 'Eliminar';

            return button;
          },
        },
      ],
    },
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
    private router: Router,
    private afs: AngularFirestore,
    private auth: AuthService,
    private modalService: BsModalService,
  ) {
    this.tableClinicHistory = <GridOptions>{
      columnDefs: this.columnsHistory,
      defaultColDef: {
        filter: true, // set filtering on for all cols
        sortable: true,
        resizable: true,
        flex: 1,
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
      this.allHistory = this.afs.collection('Expedientes_empresa').doc('Gozilla').collection('Historias_Clinicas', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
      this.subscription = this.allHistory.pipe().subscribe(async clinic_historyc => {
        if (clinic_historyc.length > 0) {
          this.histroiasList = clinic_historyc.filter((e) => !e.counter);
          this.histroiasList.map(p => {
            p['fullname'] = p.pac_nombres + ' '
              + p.pac_apPrimero + ' '
              + p.pac_apSegundo;
          });
        }
        if (!(this.tableClinicHistory.api === undefined)) {
          this.tableClinicHistory.api.setRowData(this.histroiasList);
        }
        resolve();
      });
    }).then(() => {
      this.done = true;
    });
  }

  async goToAddEmpleado(template: TemplateRef<any>) {
    //this.done = false;
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
        this.modalRef = this.modalService.show(template, this.configModal);
    });

  }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tableClinicHistory.columnApi.getColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tableClinicHistory.api.setRowData(this.histroiasList);
  }

  onQuickFilterChanged($event) {
    this.tableClinicHistory.api.setQuickFilter($event.target.value);
  }

  onQuickFilterChanged_emp($event) {
    this.tablaEmpleados.api.setQuickFilter($event.target.value);
  }

  onCellClicked(params: any) {
    if (params.colDef.headerName === 'Editar') {
      this.router.navigate(['/pages/update-empleado'],
        { queryParams: { ...params.data }, skipLocationChange: true });
    } else if (params.colDef.headerName === 'Eliminar') {
      Swal.fire({
        title: '¿Seguro que deseas Eliminar?',
        text: 'Se eliminará permanentemente el cliente ' + params.data.fullname,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar cliente',
      }).then((result) => {
        if (result.value) {
          this.afs.collection('Expedientes_empresa').doc('Gozilla').collection('empleados')
            .doc(params.data.id).delete();
          Swal.fire(
            '¡Eliminado!',
            'El Usuario ha sido eliminado de la base de datos.',
            'success',
          );
        }
      });
    } else if (params.colDef.headerName === 'USAR') {
      this.router.navigate(['/pages/add-his-clinica'],
        { queryParams: { ...params.data, componentConsu: true }, skipLocationChange: true });
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }



}
