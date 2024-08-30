import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComponentsModule, PagesModule],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'Clinica-Frontend';
}
