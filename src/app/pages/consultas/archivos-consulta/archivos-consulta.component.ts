import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultasService } from './../../../services/consultas/service-consultas.service';

@Component({
  selector: 'dln-archivos-consulta',
  templateUrl: './archivos-consulta.component.html',
  styleUrls: ['./archivos-consulta.component.scss']
})
export class ArchivosConsultaComponent implements OnInit {

  @Input() currentURL: any = null;
  @Input() currentAccion: any = null;
  @Input() currentData: any = null;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  filePath: any = '';
  extencion: any;

  constructor(
    private consultasService: ConsultasService
  ) { }

  ngOnInit() {
  }

  changeimage() {
    (<HTMLInputElement>document.getElementById("sourcer")).value = this.currentURL.fileURL;
  }

  upfile(event) {
    if (event.target.files.length > 0) {
      const f = event.target.files[0];
      this.filePath = f;
    }
  }

  async subirpdf() {
    this.currentData['fileURL'] = this.filePath;
    await this.consultasService.upfile(this.currentData).then(() => {
      this.closeModal.emit({ cerrar: true });
    }
    );
  }

}
