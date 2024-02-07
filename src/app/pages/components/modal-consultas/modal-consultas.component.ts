import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dln-modal-consultas',
  templateUrl: './modal-consultas.component.html',
  styleUrls: ['./modal-consultas.component.scss']
})
export class ModalConsultasComponent implements OnInit {

  @Input() currentURL: any = null;
  @Input() currentAccion: any = null;
  @Input() currentData: any = null;
  @Input() title_modal: string = null;

  constructor(
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    console.log('Component Modal-Consultas');
  }

  closeModal(event: any) {
    this.modalRef.hide();
  }

}
