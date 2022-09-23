import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'dln-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class ActionButtonsComponent implements OnInit {
  public params: any;
  public actvo: boolean;
  public isDisabled: boolean = false;

  constructor(
    private router: Router,
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async agInit(params: any): Promise<void> {
    this.params = params;
    if (params.data.inca_aplica == 'Si') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  refresh(params): boolean {
    if (params.value !== this.params.value) {
      if (params.data.inca_aplica == 'Si') {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      this.params = params;
    }
    return true;
  }

  view() {
    const { DataEmpleado, ...dataExamenMedico } = this.params.data;
    const NavigationExtras: NavigationExtras = {
      state: {
        dataEmpleado: this.params.data.DataEmpleado,
        dataExamenMedico: dataExamenMedico,
        action: 'view',
      }
    };
    this.router.navigate(['/pages/add-examen-medico'], NavigationExtras);
  }

  update() {
    const { DataEmpleado, ...dataExamenMedico } = this.params.data;
    const NavigationExtras: NavigationExtras = {
      state: {
        dataEmpleado: this.params.data.DataEmpleado,
        dataExamenMedico: dataExamenMedico,
        action: 'update',
      }
    };
    this.router.navigate(['/pages/add-examen-medico'], NavigationExtras);
  }

}
