import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalIncapacidadComponent } from '../../components/modal-incapacidad/modal-incapacidad.component';

@Component({
  selector: 'dln-action-incapacidad',
  templateUrl: './action-incapacidad.component.html',
  styleUrls: ['./action-incapacidad.component.scss']
})
export class ActionIncapacidadComponent implements ICellRendererAngularComp {

  public params: any;
  public actvo: boolean;
  public isDisabled: boolean = false;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

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

  terminarInca() {
    const initialState = {
      currentIncapacidad: this.params.data,
      title_modal: 'Terminar la Incapacidad',
      modalTipo: 'terminarIncapacidad',
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

  addInca() {
    const initialState = {
      currentIncapacidad: this.params.data,
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

  detIncapacidad() {
    const initialState = {
      currentIncapacidad: this.params.data,
      title_modal: 'Detalle de la Incapacidad',
      modalTipo: 'detalleInca',
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
