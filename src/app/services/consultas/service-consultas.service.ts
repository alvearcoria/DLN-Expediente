import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(
    public afs: AngularFirestore,
    public auth: AuthService,
    public router: Router,
    private storage: AngularFireStorage,
  ) { }

  updateConsulta(dataEmp, id_consulta) {
    this.router.navigate(['/pages/reporteconsulta'], { queryParams: { ...dataEmp, id_consulta: id_consulta }, skipLocationChange: true });
  }

  async getURLFile(fileURl) {
    return new Promise(async resolve => {
      this.storage.ref(fileURl).getDownloadURL().subscribe((URL) => {
        resolve(URL);
      })
    }).catch((error) => {
      Swal.fire(
        'Ver Archivos',
        'No hay archivo guardado!',
        'warning',
      );
    })
  }

  async onUpload(upDATA) {
    let filePath = '';
    filePath = this.auth.dataEmp.basedatos + '/' + upDATA.idEmpleado + '/consultas/' + upDATA.idConsulta + '/evi_pdf_firmado.pdf';
    await this.storage.upload(filePath, upDATA.fileURL).then(() => {
      console.log('Archivo subido');
    });
    return filePath;
  }

  async upfile(data) {

    let urltem = await this.onUpload(data);
    this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('consultas').doc(data.idConsulta).update({ urlPDF_Firmado: urltem }).then(() => {
      Swal.fire(
        '¡Datos Actualizado!',
        'PDF almacenado correctamente',
        'success',
      ).then(() => {

      });
    });
  }

}
