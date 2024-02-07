import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
const Swal = require('sweetalert2');
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'dln-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})

export class EmpleadosComponent implements OnInit, OnDestroy {

  private tablaEmpleados: GridOptions;
  done: boolean = false;
  usuariosList: any;
  currentEmpleado: any;
  usuarios: Observable<any>;
  subscription: Subscription;

  columnasEmpleados = [

    { width: 60, headerName: 'No', field: 'idNumerico', sort: 'asc', },  //era idNumerico
    { width: 130, headerName: 'ID/Nomina', field: 'pac_nomina' },  //era idNumerico
    { width: 250, headerName: 'Nombre(s)', field: 'fullname' },
    { width: 130, headerName: 'Ciudad', field: 'pac_ciudad' },
    { width: 210, headerName: 'Empresa', field: 'ori_pac_name' },
    { width: 150, headerName: 'Area', field: 'area' },
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
        {
          width: 120,
          headerName: 'Registrar historial',
          field: 'id',
          pinned: 'right',

          cellRenderer: (params) => {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fas fa-file-medical"></i>';
            button.classList.add('btn');
            button.classList.add('btn-sm');
            button.classList.add('btn-info');
            button.title = 'Registrar historial';
            return button;
          },
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private auth: AuthService,
    //private excelService: ExporterService,
  ) {
    this.tablaEmpleados = <GridOptions>{
      columnDefs: this.columnasEmpleados,
      defaultColDef: {
        filter: true, // set filtering on for all cols
        sortable: true,
        resizable: true,
        flex: 1,
      },
      rowData: null,
    };
  }

  async ngOnInit() {
    await new Promise<void>(resolve => {

      /* console.log('Auth-->>>> ', this.auth )
      console.log('Datos Empresa-->>>> ', this.auth.dataEmp )
      console.log('Datos UserData-->>>> ', this.auth.userData )
      console.log(this.auth.currentUserId); */

      this.usuarios = this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('empleados', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
      this.subscription = this.usuarios.pipe().subscribe(async usuarios => {
        if (usuarios.length > 0) {
          this.usuariosList = usuarios.filter((e) => !e.counter);
          this.usuariosList.map(p => {
            p['fullname'] = p.pac_nombres + ' '
              + p.pac_apPrimero + ' '
              + p.pac_apSegundo;
          });
        }

        if (!(this.tablaEmpleados.api === undefined)) {
          this.tablaEmpleados.api.setRowData(this.usuariosList);
        }
        resolve();
      });
    }).then(() => {
      this.done = true;
    });
  }

  goToAddEmpleado() {
    this.done = false;//true;   //DEBUGGIN setrowdata despues de addempleados
    this.router.navigate(['/pages/add-empleado'],
      { queryParams: {}, skipLocationChange: true });
  }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tablaEmpleados.columnApi.getColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tablaEmpleados.api.setRowData(this.usuariosList);
  }

  onQuickFilterChanged($event) {
    this.tablaEmpleados.api.setQuickFilter($event.target.value);
  }

  /* exportExcel(): void {
    this.excelService.exportToExcel(this.usuariosList, 'pacientes');
  } */

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
          this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('empleados')
            .doc(params.data.id).delete();
          Swal.fire(
            '¡Eliminado!',
            'El Usuario ha sido eliminado de la base de datos.',
            'success',
          );
        }
      });
    } else if (params.colDef.headerName === 'Registrar historial') {//HISTORIAL MODULE 14may21
      this.router.navigate(['/pages/expediente'],
        { queryParams: { ...params.data, skipLocationChange: true }, skipLocationChange: true });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
