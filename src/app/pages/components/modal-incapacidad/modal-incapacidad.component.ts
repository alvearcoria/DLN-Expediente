import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'dln-modal-incapacidad',
  templateUrl: './modal-incapacidad.component.html',
  styleUrls: ['./modal-incapacidad.component.scss']
})
export class ModalIncapacidadComponent implements OnInit {

  @Input() currentIncapacidad: any = null;
  @Input() currentdetalle_inca: any = null;
  @Input() modalTipo: string = null;
  @Input() title_modal: string = null;

  constructor(
    public modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  closeModal(event: any) {
    this.modalRef.hide();
  }

}
