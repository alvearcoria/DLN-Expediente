import { User } from './../../../@core/data/users';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'dln-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  currentTheme = 'default';
  nameEmpresa: string = '';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private auth: AuthService,
              ) {
  }

  async ngOnInit() {
/*     console.log('Encabezado >>>>>>>>>>');

    console.log('Auth >>>>>>>', this.auth);
    console.log('UserData >>>', this.auth.userData);
    console.log(await this.auth.getUserAccount()); */


    
    this.nameEmpresa = 'errorExc';

 /*    this.auth.afAuth.authState.subscribe(
      async x => {
        console.log(x)
        if ( x != null) {
          
          if(this.user.foto=="" && this.user.sexo=='masculino'){
            this.user['img']='https://firebasestorage.googleapis.com/v0/b/dlnclinico.appspot.com/o/fotos_users%2Fuser-male.png?alt=media&token=0ac17f17-9160-490f-8bea-939654e4318f'
          }else if(this.user.foto=="" && this.user.sexo=='femenino'){
            this.user['img']='https://firebasestorage.googleapis.com/v0/b/dlnclinico.appspot.com/o/fotos_users%2Fuser_famele.png?alt=media&token=5d2239d2-b9e1-4217-bfe6-0a055714ae0b'
          }else{
            this.user['img']=this.user.foto;
          }
        }
      }
    ); */

    this.menuService.onItemClick().pipe(
      filter(({ tag }) => tag === 'my-context-menu' ),
      map(({ item: { title }}) => title),
    ).subscribe(title => {
      if (title === 'Log out'){
        this.auth.SignOut();
      }
    });
    
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
