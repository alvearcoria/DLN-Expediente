import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dln-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit {

  URLFile: any = "";
  extencion: any;

  @ViewChild('ModalOpen', { static: false }) public ModalOpen: ElementRef;

  openModalRef: BsModalRef;

  configModal = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'modal-xl',
  };

  constructor(
    private modalService: BsModalService,
  ) {
  }

  async ngOnInit() {

  }

  changeimage() {
    (<HTMLInputElement>document.getElementById("sourcer")).value = this.URLFile;
  }

  async viewfile(urlfile, extension,) {
    this.extencion = extension
    this.URLFile = urlfile;
    setTimeout(() => {this.openModal();}, 50);
  }

  openModal() {
    this.openModalRef = this.modalService.show(this.ModalOpen, this.configModal);
  }

  closeModal() {
    this.openModalRef.hide();
  }

}
