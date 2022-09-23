import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'dln-logout',
  template: '<p>LOGOUT</p>'
})
export class LogoutComponent implements OnInit {

  constructor(public auth: AuthService) {
    
  }

  ngOnInit(): void {
    this.auth.SignOut();
  }

}
