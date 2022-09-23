import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';

const Swal = require('sweetalert2');

@Component({
	selector: 'dln-regsubempresas',
	templateUrl: './regsubempresas.component.html',
	styleUrls: ['./regsubempresas.component.scss']
})
export class RegsubempresasComponent implements OnInit, OnDestroy {

	done: boolean = false;
	subempresaList: any;
	currentSubempresa: any;
	subempresa: Observable<any>;
	subscription: Subscription;
	private tablaSubempresas: GridOptions;

	columnDefs = [
		{ width: 130, headerName: 'ID', field: 'idNumerico' },  //era idNumerico
		{ width: 250, headerName: 'Nombre(s)', field: 'nombre' },
		{ width: 130, headerName: 'Ciudad', field: 'direccion' },
		{
			headerName: 'Opciones',
			children: [
				{
					width: 80,
					headerName: 'Editar',
					field: 'id',
					cellRenderer: (params) => {
						const button = document.createElement('button');
						button.innerHTML = '<i class="fas fa-user-edit mt-0"></i>';
						button.classList.add('btn');
						button.classList.add('btn-sm');
						button.classList.add('btn-primary');
						button.title = 'Editar';
						return button;
					},
				},
				{
					width: 90,
					headerName: 'Eliminar',
					field: 'id',
					cellRenderer: (params) => {
						const button = document.createElement('button');
						button.innerHTML = '<i class="fas fa-user-minus mt-0"></i>';
						button.classList.add('btn');
						button.classList.add('btn-sm');
						button.classList.add('btn-danger');
						button.title = 'Eliminar';

						return button;
					},
				},
			],
		},
	];

	constructor(
		private afs: AngularFirestore,
		private router: Router,
	) {
		this.tablaSubempresas = <GridOptions>{

			columnDefs: this.columnDefs,
			defaultColDef: {
				filter: true, // set filtering on for all cols
				sortable: true,
			},
			rowData: null,
		};

	}
	async ngOnInit() {
		await new Promise<void>(resolve => {
			this.subempresa = this.afs.collection('Expedientes_empresa').doc('Gozilla')
				.collection('subempresas', ref => ref.orderBy('idNumerico', 'asc')).valueChanges();
			this.subscription = this.subempresa.subscribe(subempresa => {
				this.subempresaList = subempresa.filter((e) => e.estatus != 'eliminado');
				if (!(this.tablaSubempresas.api === undefined)) {
					this.tablaSubempresas.api.setRowData(this.subempresaList);
				}
				resolve();
			});
		}).then(() => {
			this.done = true;
		});
	}

	goToaddsubempresa() {
		this.done = false;
		this.router.navigate(['/pages/addsubempresa'],
			{ queryParams: {}, skipLocationChange: true });
	}

	gridReady(params: any) {
		const allColumnIds = [];
		this.tablaSubempresas.columnApi.getColumns().forEach(function (column) {
			allColumnIds.push(column['colId']);
		});
		this.tablaSubempresas.api.setRowData(this.subempresaList);
	}

	onQuickFilterChanged($event) {
		this.tablaSubempresas.api.setQuickFilter($event.target.value);
	}

	onCellClicked(params: any) {
		this.currentSubempresa = params.data;
		if (params.colDef.headerName === 'Editar') {
			this.router.navigate(['/pages/update-subempresa'],
				{ queryParams: { id_subemp: params.data.id, }, skipLocationChange: true });

		} else if (params.colDef.headerName === 'Eliminar') {
			Swal.fire({
				title: '¿Seguro que deseas Eliminar?',
				text: 'Se eliminará permanentemente la subempresa ' + this.currentSubempresa.displayName,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, Eliminar subempresa',
			}).then((result) => {
				if (result.value) {
					/* this.afs.collection(this.auth.dataEmp.raiz).doc(this.auth.dataEmp.basedatos).collection('subempresas')
						.doc(params.data.id).update({
							estatus: 'eliminado',
							f_eliminado: new Date(),
							user_elimina: this.auth.currentUserId
						}).then(() => {
							Swal.fire(
								'¡Eliminado!',
								'El reporte se elimino de la base de datos.',
								'success',
							);
						}); */
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
