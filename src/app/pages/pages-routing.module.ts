import { AddConsultaComponent } from './consultas/add-consulta/add-consulta.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { AddExamenMedicoComponent } from './examenes-medicos/add-examen-medico/add-examen-medico.component';
import { ExamenesMedicosComponent } from './examenes-medicos/examenes-medicos.component';
import { AddHisClinicaComponent } from './historia-clinica/add-his-clinica/add-his-clinica.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { AddsubempresaComponent } from './regsubempresas/addsubempresa/addsubempresa.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { LogoutComponent } from '../auth/logout/logout.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AddempleadoComponent } from './empleados/addempleado/addempleado.component';
import { RegsubempresasComponent } from './regsubempresas/regsubempresas.component';
import { IncapacidadesComponent } from './incapacidades/incapacidades.component';
import { CheckupComponent } from './checkup/checkup.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'empleados',
      component: EmpleadosComponent,
    },
    {
      path: 'add-empleado',
      component:  AddempleadoComponent,
    },
    {
      path: 'update-empleado',
      component: AddempleadoComponent,
    },
    {
      path: 'subempresas',
      component: RegsubempresasComponent,
    },
    {
      path: 'addsubempresa',
      component: AddsubempresaComponent,
    },
    {
      path: 'update-subempresa',
      component: AddsubempresaComponent,
    },
    {
      path:'historia-clinica',
      component: HistoriaClinicaComponent,
    },
    {
      path: 'add-his-clinica',
      component: AddHisClinicaComponent,
    },
    {
      path: 'update-his-clinica',
      component: AddHisClinicaComponent,
    },
    {
      path: 'examenes-medicos',
      component: ExamenesMedicosComponent,
    },
    {
      path: 'add-examen-medico',
      component: AddExamenMedicoComponent,
    },
    {
      path: 'consultas',
      component: ConsultasComponent,
    },
    {
      path: 'add-consulta',
      component: AddConsultaComponent,
    },
    {
      path: 'incapacidades',
      component: IncapacidadesComponent,
    },
    {
      path: 'checkup',
      component: CheckupComponent,
    },

    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'salir',
      component: LogoutComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
