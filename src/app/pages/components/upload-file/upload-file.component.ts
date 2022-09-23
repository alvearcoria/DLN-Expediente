import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dln-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @ViewChild('uploadfileModal', { static: false }) public modalUpload: ElementRef;
  @Output() file: EventEmitter<any> = new EventEmitter<any>();

  filePath: any;
  modalRef: BsModalRef;
  idempleado:any;
  id_consulta: any;

  configModal = {
    keyboard: false,
    scrollable: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
  };

  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  modalfirmaPDF(modalupload: TemplateRef<any>, idempleado, id_consulta) {
    this.idempleado = idempleado;
    this.id_consulta = id_consulta;
    this.modalRef = this.modalService.show(modalupload, this.configModal);
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  upfile(event) {
    if (event.target.files.length > 0) {
      const f = event.target.files[0];
      this.filePath = f;
    }
  }

  async onUpload(DATA_URL) {
    let filePath = '';
    filePath = this.auth.dataEmp.basedatos + '/' + this.idempleado + '/consultas/' + this.id_consulta + '/evi_pdf_firmado.pdf';
    await this.storage.upload(filePath, DATA_URL).then(() => {
      console.log('Archivo subido');
    });
    return filePath;
  }

  async subirpdf() {
    let urltem =  await this.onUpload(this.file);
    console.log(urltem);
    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas').doc(this.id_consulta).update({ urlPDF_Firmado: urltem }).then(() => {
      this.cerrarModal();
      Swal.fire(
        '¡Datos Actualizado!',
        'PDF almacenado correctamente',
        'success',
      ).then(() => {
        this.cerrarModal();
      });
    });
  }

}
