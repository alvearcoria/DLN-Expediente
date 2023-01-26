import { Component } from '@angular/core';

@Component({
  selector: 'dln-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b>Alexander Alvear</b> 2022
    </span>
    <div class="socials">
      <a href="https://github.com/alvearcoria" target="_blank" class="ion ion-social-github"></a>
      <a href="https://www.facebook.com/alvearcoria92" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://twitter.com/xander13_" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/in/alexalvear92" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
