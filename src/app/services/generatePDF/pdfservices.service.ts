import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../../auth/auth.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfservicesService {

  constructor(
    public datepipe: DatePipe,
    private storage: AngularFireStorage,
    private auth: AuthService,

  ) { }

  generarPDFConsulta(empresa, dataEmpleado, dataReport) {

    return new Promise((resolve) => {
      let partes_cuerpo;
      if (dataReport.consu_tipo != 'Enfermedad general') {
        partes_cuerpo = dataReport.accidente_parteAfectada.toString();
      }
      let fechaCuest = this.datepipe.transform(dataReport.consu_fecha, 'yyyy-MM-dd');
      let edad;
      try {
        const birthday_arr = dataEmpleado.pac_fNacimiento.split("-");
        const birthday_date = new Date(
          Number(birthday_arr[0]),
          Number(birthday_arr[1]) - 1,
          Number(birthday_arr[2])
        );
        const ageDifMs = Date.now() - birthday_date.getTime();
        const ageDate = new Date(ageDifMs);
        edad = Math.abs(ageDate.getUTCFullYear() - 1970);

      } catch { console.log("error obteniendo edad de fnacimiento") }

      let RepoGeneral = [];
      let Repofin = [];

      let RepoContenido = [
        { text: 'Consulta médica -', style: 'header' },
        { text: empresa, style: 'header' },

        { text: 'Datos generales del paciente: ', style: 'subheader' },
        {
          style: 'tableExample',
          table: {
            widths: [380, '*'],
            body: [
              [
                {
                  style: 'tableExample',
                  table: {
                    widths: [120, 120, '*'],
                    body: [
                      [
                        { text: 'Primer Apellido', style: 'headCuest' },
                        { text: 'Segundo Apellido', style: 'headCuest' },
                        { text: 'Nombre(s)', style: 'headCuest' }
                      ],
                      [
                        { text: dataEmpleado.pac_apPrimero, style: 'headData' },
                        { text: dataEmpleado.pac_apSegundo, style: 'headData' },
                        { text: dataEmpleado.pac_nombres, style: 'headData' }
                      ]
                    ]
                  }
                },
                [
                  {
                    style: 'tableExample',
                    widths: [60, 60, '*'],
                    table: {
                      body: [
                        [
                          { text: 'Genero', style: 'headCuest' },
                          { text: 'Edad', style: 'headCuest' },
                          { text: 'F Nac', style: 'headCuest' }
                        ],
                        [
                          { text: dataEmpleado.pac_sexo, style: 'headData' },
                          { text: edad, style: 'headData' },
                          { text: dataEmpleado.pac_fNacimiento, style: 'headData' }]
                      ]
                    },
                  }
                ]
              ]
            ]
          },
          layout: 'noBorders'
        },

        {
          style: 'tableExample',
          table: {
            widths: [120, '*',],
            body: [
              [
                {
                  style: 'tableExample',
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'IMSS', style: 'headCuest' },
                        { text: 'Nomina', style: 'headCuest' },
                      ],
                      [
                        { text: dataEmpleado.pac_imss, style: 'headData' },
                        { text: dataEmpleado.pac_nomina, style: 'headData' }
                      ]
                    ]
                  }
                },
                {
                  style: 'tableExample',
                  table: {
                    widths: [250, '*'],
                    body: [
                      [
                        { text: 'Sub-empresa', style: 'headCuest' },
                        { text: 'Area', style: 'headCuest' },
                      ],
                      [
                        { text: dataEmpleado.ori_pac_name, style: 'headData' },
                        { text: dataEmpleado.area, style: 'headData' }
                      ]
                    ]
                  }
                },

              ]
            ]
          },
          layout: 'noBorders'
        },

        {
          style: 'tablefecha',
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  style: 'tablefecha',
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'Fecha consulta', style: 'headCuest' },
                        { text: 'Turno', style: 'headCuest' },
                      ],
                      [
                        { text: fechaCuest, fontSize: 10, alignment: 'center' },
                        { text: dataReport.consu_turno, fontSize: 10, alignment: 'center' },
                      ],
                    ]
                  }
                },

                {
                  style: 'tablefecha',
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'Tipo Consulta', style: 'headCuest' },
                        { text: 'Tipo de riesgo', style: 'headCuest' },
                      ],
                      [
                        { text: dataReport.consu_tipo, fontSize: 10, alignment: 'center' },
                        { text: dataReport.tipo_urge, fontSize: 10, alignment: 'center' },
                      ],
                    ]
                  }
                }
              ],
            ]
          },
          layout: 'noBorders'
        },

        { text: '\n Signos vitales.', style: 'subheader' },

        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  style: 'tableExample',
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'Presion arterial', style: 'headCuest' },
                        { text: 'Frecuencia cardiaca', style: 'headCuest' },
                      ],
                      [
                        { text: dataReport.pre_arterial, style: 'headData' },
                        { text: dataReport.frec_cardiaca, style: 'headData' }
                      ]
                    ]
                  }
                },
                {
                  style: 'tableExample',
                  table: {
                    widths: ['*', '*'],
                    body: [
                      [
                        { text: 'Frecuencia respiratoria', style: 'headCuest' },
                        { text: 'Temperatura (C°)', style: 'headCuest' },
                      ],
                      [
                        { text: dataReport.frec_respi, style: 'headData' },
                        { text: dataReport.temperatura, style: 'headData' }
                      ]
                    ]
                  }
                },

              ]
            ]
          },
          layout: 'noBorders'
        },

      ];

      if (dataReport.consu_tipo != 'Riesgo de trabajo') {

        RepoGeneral = [
          { text: '\n Datos de la consulta.', style: 'subheader' },
          /* {
            style: 'tableExample',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      heights: ['*', 100],
                      body: [
                        [
                          { text: 'Descripcion de los síntomas:', style: 'headcontent' },
                        ],
                        [{ text: dataReport.descripcion_sintomas, style: 'content' }]
                      ]
                    }
                  }
                ],
              ]
            },
            layout: 'noBorders'
          }, */

          {
            style: 'tableExample',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      heights: ['*', 100],
                      body: [
                        [
                          { text: 'Diagnóstico:', style: 'headcontent' },
                        ],
                        [{ text: dataReport.diagnostico_clinico, style: 'content' }]
                      ]
                    }
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },

          {
            style: 'tableExample',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      heights: ['*', 100],
                      body: [
                        [
                          { text: 'Receta:', style: 'headcontent' },
                        ],
                        [{ text: dataReport.receta, style: 'content' }]
                      ]
                    }
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
        ]
      }

      else {
        let faccidente = this.datepipe.transform(dataReport.accidente_faccidente, 'yyyy-MM-dd');
        let facude = this.datepipe.transform(dataReport.accidente_facude, 'yyyy-MM-dd');
        RepoGeneral = [
          { text: '\n Datos del ' + dataReport.tipo_urge, style: 'subheader' },
          {
            style: 'tableExample',
            table: {
              widths: ['*',],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*'],
                      body: [
                        [
                          { text: 'Fecha del accidente:', style: 'headCuest' },
                          { text: 'Fecha en la que acude:', style: 'headCuest' },
                        ],
                        [
                          { text: faccidente, style: 'headData' },
                          { text: facude, style: 'headData' }
                        ]
                      ]
                    }
                  },
                ]
              ]
            },
            layout: 'noBorders'
          },

          {
            style: 'tableExample',
            table: {
              widths: ['*',],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*', '*'],
                      body: [
                        [
                          { text: 'Atendio:', style: 'headCuest' },
                          { text: 'Tipo de riesgo', style: 'headCuest' },
                          { text: 'Supervisor:', style: 'headCuest' },
                        ],
                        [
                          { text: dataReport.accidente_atendio, style: 'headData' },
                          { text: dataReport.accidente_tiporiesgo, style: 'headData' },
                          { text: dataReport.accidente_supervisor, style: 'headData' },
                        ]
                      ]
                    }
                  },
                ]
              ]
            },
            layout: 'noBorders'
          },

          { text: '\n Datos de diagnostico', style: 'subheader' },

          {
            style: 'tableExample',
            table: {
              widths: ['*',],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*'],
                      body: [
                        [
                          { text: 'Parte del cuerpo afectada:', style: 'headCuest' },
                          { text: 'Diagnóstico:', style: 'headCuest' },
                        ],
                        [
                          { text: partes_cuerpo, style: 'headData' },
                          { text: dataReport.accidente_diagnostico, style: 'headData' }
                        ]
                      ]
                    }
                  },
                ]
              ]
            },
            layout: 'noBorders'
          },

          {
            style: 'tableExample',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      heights: ['*', 90],
                      body: [
                        [
                          { text: 'Observaciones del diagnostico:', style: 'headcontent' },
                        ],
                        [{ text: dataReport.accidente_observacion, style: 'content' }]
                      ]
                    }
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
          {
            style: 'tableExample',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      heights: ['*', 90],
                      body: [
                        [
                          { text: 'Observaciones generales:', style: 'headcontent' },
                        ],
                        [{ text: dataReport.accidente_diag_general, style: 'content' }]
                      ]
                    }
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
        ]
      }

      Repofin = [
        { text: '\n ¿Después de la consulta el paciente:? ' + dataReport.se_refiere, fontSize: 13, bold: true },
        { text: '\n Nombre y firma de quien atiende.\n\n', alignment: 'center', fontSize: 13, bold: true },
        { text: ' ______________________________________________', alignment: 'center', fontSize: 11, bold: true },
        { text: dataReport.nombre_atiende, alignment: 'center', fontSize: 10, bold: true }
      ]

      RepoContenido = RepoContenido.concat(RepoGeneral, Repofin)

      var dd = {
        content: RepoContenido,
        styles: {
          tablefecha: {
            alignment: 'right'
          },

          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 3],
            alignment: 'right'
          },

          subheader: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 5]
          },

          headCuest: {
            fontSize: 10,
            bold: true,
            alignment: 'center',
          },

          headData: {
            fontSize: 8,
            alignment: 'center',
          },

          headcontent: {
            fontSize: 11,
            bold: true,
            //alignment: 'center',
          },

          content: {
            fontSize: 9,
            alignment: 'justify',
            margin: [0, 0, 0, 5]
          }
        },

        defaultStyle: {
          // alignment: 'justify'
        },
      }

      const pdfDocGenerator = pdfMake.createPdf(dd);
      //pdfMake.createPdf(dd).open();

      pdfDocGenerator.getBlob((blob) => {
        let pathpdf = empresa + '/' + dataEmpleado.id + '/consultas/' + dataReport.id_consulta + '/CuestionarioConsulta.pdf';
        this.storage.upload(pathpdf, blob, { contentType: 'application/pdf', }).then((data) => {
          resolve(pathpdf)
        })
      });
    })
  }
}
