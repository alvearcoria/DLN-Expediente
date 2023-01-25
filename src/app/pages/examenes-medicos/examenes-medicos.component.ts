import { take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ServicesExamenesMedicosService } from '../../services/examenes-medicos/services-examenes-medicos.service';

import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'dln-examenes-medicos',
  templateUrl: './examenes-medicos.component.html',
  styleUrls: ['./examenes-medicos.component.scss']
})
export class ExamenesMedicosComponent implements OnInit, OnDestroy {

  subscription: Subscription;


 // @ViewChild('modalEmpleados', { static: false }) public emp_modal: ElementRef;
  modalRef: BsModalRef;
  configModal = {
    keyboard: false,
    scrollable: false,
    backdrop: true,
    ignoreBackdropClick: true,
    animated: true,
    class: 'modal-lg',
  };

  columnasempleados = [

    { width: 60, headerName: 'ID', field: 'idNumerico' },
    { width: 80, headerName: 'Nomina', field: 'pac_nomina' },
    { width: 250, headerName: 'Nombre del empleado', field: 'fullname' },
    { width: 300, headerName: 'Origen empreesa', field: 'ori_pac_name' },
    {
      width: 80,
      headerName: 'USAR',
      field: 'id',
      pinned: 'right',
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

  private tablaEmpleados: GridOptions;
  private tablaExamenesOcup: GridOptions;
  done: boolean = false;
  examenesList: any;
  empleadoslist: any;

  columnasExamenesMedicos = [

    {
      width: 120, headerName: 'Fecha Examen', field: 'f_examen_medico',
      cellRenderer: (data) => {
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
    { width: 250, headerName: 'Nombre del paciente', field: 'fullname' },
    { width: 100, headerName: 'NSS', field: 'DataEmpleado.pac_imss' },
    { width: 150, headerName: 'Nomina', field: 'DataEmpleado.pac_nomina' },
    {
      width: 250,
      headerName: 'Acciones componente',
      cellRendererFramework: ActionButtonsComponent,
      //cellRendererParams: { currentEmpleado: { mensaje:'hola', } },
      pinned: 'right',
    }
  ];

  constructor(
    private ServiceExaMed: ServicesExamenesMedicosService,
    private modalService: BsModalService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.tablaExamenesOcup = <GridOptions>{
      columnDefs: this.columnasExamenesMedicos,
      defaultColDef: {
        filter: true, // set filtering on for all cols
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
      this.ServiceExaMed.getAllEmpleados().pipe().subscribe((dataEmpleados) => {
        this.empleadoslist = dataEmpleados;
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
      this.ServiceExaMed.getAllExamenes().pipe(take(1)).subscribe(allExamenes => {
        this.examenesList = allExamenes;

        this.examenesList.map(exa => {
          exa['fullname'] = exa.DataEmpleado.pac_nombres + ' '
            + exa.DataEmpleado.pac_apPrimero + ' '
            + exa.DataEmpleado.pac_apSegundo;
        });

        if (!(this.tablaExamenesOcup.api === undefined)) {
          this.tablaExamenesOcup.api.setRowData(this.examenesList);
        }
        resolve();
      });
    }).then(() => {
      this.done = true;
    });
  }

  onQuickFilterChanged($event) {
    this.tablaExamenesOcup.api.setQuickFilter($event.target.value);
  }

  onQuickFilterChanged_emp($event) {
    this.tablaEmpleados.api.setQuickFilter($event.target.value);
  }

  onCellClicked(params: any) {
    if (params.colDef.headerName === 'USAR') {
      //this.router.navigate(['/pages/add-examen-medico'], { queryParams: { ...params.data }, skipLocationChange: true });
      const NavigationExtras: NavigationExtras = {
        state: {
          dataEmpleado: params.data,
          dataExamenMedico: null,
          action: 'add'
        }
      };
      this.router.navigate(['/pages/add-examen-medico'], NavigationExtras);
      this.cerrarModal();
    }
  }

  gridReady(params: any) {
    const allColumnIds = [];
    this.tablaExamenesOcup.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column['colId']);
    });
    this.tablaExamenesOcup.api.setRowData(this.examenesList);
  }

  goToAddexaOcup() {
    console.log('goToAddexaOcup');
  }

  async modalEmpleado(modalEmpleados: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalEmpleados, this.configModal);
  }
  cerrarModal() {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
