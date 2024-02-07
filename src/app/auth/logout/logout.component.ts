import { Component } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'dln-logout',
  template: '<p>LOGOUT</p>'
})
export class LogoutComponent {

  constructor(public auth: AuthService) {
    this.auth.SignOut();
  }



}
