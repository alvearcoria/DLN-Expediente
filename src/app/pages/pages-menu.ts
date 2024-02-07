import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
    icon: 'hospital',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Registro Checkup',
    icon: 'user-tie',
    link: '/pages/checkup',
  },
  {
    title: 'Empleados',
    icon: 'user-tie',
    link: '/pages/empleados',
  },

  {
    title: 'Registro subempresas',
    icon: 'file-alt',
    link: '/pages/subempresas',
  },

  {
    title: 'Historia Clinica',
    icon: 'book-medical',
    link: '/pages/historia-clinica',
  },

  {
    title: 'Consultas',
    icon: 'file-medical',
    link: '/pages/consultas',
  },

  {
    title: 'Incapacidades',
    icon: 'procedures',
    link: '/pages/incapacidades',
  },

  {
    title: 'Examenes Medicos',
    icon: 'file-medical-alt',
    link: '/pages/examenes-medicos',
  },
  {
    title: 'Miscellaneous',
    icon: 'house-medical-circle-xmark',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'Salir',
    icon: 'sign-out-alt',
    link: '/pages/salir',
  },

];
