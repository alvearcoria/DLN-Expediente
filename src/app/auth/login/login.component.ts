import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'dln-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  cuentaError = false;
  emailError = false;
  passError = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      num_cuenta: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  ngOnInit(): void {
    this.onChanges();
  }

  get f() { return this.loginForm.controls; }

  onChanges(): void {
    this.loginForm.get('num_cuenta').valueChanges.subscribe(val => {
      this.cuentaError = false;
      if (!this.loginForm.controls['num_cuenta'].valid) this.cuentaError = true;
    });

    this.loginForm.get('email').valueChanges.subscribe(val => {
      this.emailError = false;
      if (!this.loginForm.controls['email'].valid) this.emailError = true;
    });

    this.loginForm.get('password').valueChanges.subscribe(val => {
      this.passError = false;
      if (!this.loginForm.controls['password'].valid) this.passError = true;
    });
  }

  login() {
    this.auth.SignIn(
      this.loginForm.controls['num_cuenta'].value,
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value ).then(res => {
        this.router.navigate(['/pages']);
      }, err => {
        console.log(err);
        if (err == 'errCuenta') this.errorMessage = "La cuenta proporcinada no existe favor de verificarla";
        if (err == 'errEmpUser') this.errorMessage = "El usuario proporcionado no existe dentro de la empresa proporcionada, favor de verificar el usuario o su numero de cuenta.";
        if (err.code == 'auth/user-not-found') this.errorMessage = "El usuario no esta registrado o pudo haber sido eliminado";
        if (err.code == 'auth/wrong-password') this.errorMessage = "La contraseña es incorrecta";
      })
  }

}
