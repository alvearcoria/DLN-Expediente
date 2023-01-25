import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalConsultasComponent } from './../../components/modal-consultas/modal-consultas.component';
import { ConsultasService } from '../../../services/consultas/service-consultas.service';

@Component({
  selector: 'dln-acciones-consulta',
  templateUrl: './acciones-consulta.component.html',
  styleUrls: ['./acciones-consulta.component.scss']
})
export class AccionesConsultaComponent implements ICellRendererAngularComp {

  public params: any;
  public actvo: boolean;
  public isDisabled: boolean = false;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private consultasService: ConsultasService
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

  viewConsulta() {
    console.log('updateConsulta');
    this.params.data.currentEmpleado['componentConsu'] = true;
    this.consultasService.updateConsulta(this.params.data.currentEmpleado, this.params.data.id_consulta);
  }

  async viewFile() {
    console.log('viewFile');
    const extencion = this.params.data.urlPDF.split('.').pop();
    const fileURL = await this.consultasService.getURLFile(this.params.data.urlPDF);

    const initialState = {
      currentURL: { fileURL: fileURL, fileExt: extencion },
      currentAccion: 'ViewFile',
      title_modal: 'Reporte de consulta',
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };

    this.modalRef = this.modalService.show(ModalConsultasComponent, {
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      //class: 'gray modal-lg', initialState
    });

  }

  uploadFile() {
    console.log('uploadFile');
    const initialState = {
      currentData: { idConsulta: this.params.data.id_consulta, idEmpleado: this.params.data.id },
      currentAccion: 'upFile',
      title_modal: 'Subir archivo',
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    };

    this.modalRef = this.modalService.show(ModalConsultasComponent, {
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      //class: 'gray modal-lg', initialState
    });
  }

}
