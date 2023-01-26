import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'dln-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <dln-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </dln-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = [];
  done: boolean = false;

  constructor(private iconLibraries: NbIconLibraries, private auth: AuthService) {
    this.iconLibraries.registerFontPack('fa', { packClass: 'fas', iconClassPrefix: 'fa' });
    this.iconLibraries.setDefaultPack('fa');
  }

  ngOnInit(): void {
    this.auth.afAuth.authState.subscribe(
      async x => {
        if (x != null) {
          await this.auth.getUserAccount();
          let menu_prueba = [];
          MENU_ITEMS.forEach(m => {
            if (this.auth.userData.permisos[m.title]) {
              let menu = m;
              if (m.children) {
                let submenu = []
                m.children.forEach(sub => {
                  if (this.auth.userData.permisos[m.title][sub.title]) {
                    submenu.push(sub);
                  }
                })
                delete menu.children;
                menu.children = submenu;
              }
              menu_prueba.push(menu);
            }
          });
          this.menu = menu_prueba;
          this.done = true;
        } else {

        }
      });
  }
}
