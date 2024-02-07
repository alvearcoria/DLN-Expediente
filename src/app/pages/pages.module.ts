import { NgModule } from '@angular/core';
import {
  NbMenuModule, NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbCheckboxModule,
  NbIconModule, NbInputModule, NbLayoutModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbDialogModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule, NgSelectConfig, } from '@ng-select/ng-select';

// Declaracion de componentes.
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AddempleadoComponent } from './empleados/addempleado/addempleado.component';
import { RegsubempresasComponent } from './regsubempresas/regsubempresas.component';
import { AddsubempresaComponent } from './regsubempresas/addsubempresa/addsubempresa.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { AddHisClinicaComponent } from './historia-clinica/add-his-clinica/add-his-clinica.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { AddConsultaComponent } from './consultas/add-consulta/add-consulta.component';
import { AccionesConsultaComponent } from './consultas/acciones-consulta/acciones-consulta.component';
import { ArchivosConsultaComponent } from './consultas/archivos-consulta/archivos-consulta.component';
import { ExamenesMedicosComponent } from './examenes-medicos/examenes-medicos.component';
import { AddExamenMedicoComponent } from './examenes-medicos/add-examen-medico/add-examen-medico.component';
import { ActionButtonsComponent } from './examenes-medicos/action-buttons/action-buttons.component';
import { IncapacidadesComponent } from './incapacidades/incapacidades.component';
import { ActionIncapacidadComponent } from './incapacidades/action-incapacidad/action-incapacidad.component';
import { AddIncapacidadComponent } from './incapacidades/add-incapacidad/add-incapacidad.component';
import { DetallesIncapacidadComponent } from './incapacidades/detalles-incapacidad/detalles-incapacidad.component';
import { EndIncapacidadComponent } from './incapacidades/end-incapacidad/end-incapacidad.component';
import { CamaraComponent } from './components/camara/camara.component';
import { EfirmaComponent } from './components/efirma/efirma.component';
import { ModalConsultasComponent } from './components/modal-consultas/modal-consultas.component';
import { ModalIncapacidadComponent } from './components/modal-incapacidad/modal-incapacidad.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ViewFileComponent } from './components/view-file/view-file.component';
import { ViewfilePDFPipe } from './viewfile-pdf.pipe';
import { CheckupComponent } from './checkup/checkup.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbCheckboxModule,
    NbIconModule, NbInputModule, NbLayoutModule, NbRadioModule, NbSelectModule, NbSpinnerModule,
    NbDialogModule.forRoot(),
    NgSelectModule, 
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
    EmpleadosComponent,
    AddempleadoComponent,
    RegsubempresasComponent,
    AddsubempresaComponent,
    HistoriaClinicaComponent,
    AddHisClinicaComponent,
    ConsultasComponent,
    AddConsultaComponent,
    AccionesConsultaComponent,
    ArchivosConsultaComponent,
    ExamenesMedicosComponent,
    AddExamenMedicoComponent,
    ActionButtonsComponent,
    IncapacidadesComponent,
    ActionIncapacidadComponent,
    AddIncapacidadComponent,
    DetallesIncapacidadComponent,
    EndIncapacidadComponent,
    CamaraComponent,
    EfirmaComponent,
    ModalConsultasComponent,
    ModalIncapacidadComponent,
    UploadFileComponent,
    ViewFileComponent,
    ViewfilePDFPipe,
    CheckupComponent,
  ],
  providers: [
    NgSelectConfig,
  ],
})
export class PagesModule {
}
