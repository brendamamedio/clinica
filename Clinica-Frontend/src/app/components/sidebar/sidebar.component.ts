import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Início', icon: 'pi pi-home', routerLink: ['/'] },
      { label: 'Pacientes', icon: 'pi pi-users', routerLink: ['/pacients'] },
      { label: 'Prescrições', icon: 'pi pi-clipboard', routerLink: ['/prescriptions'] },
      { label: 'Doenças', icon: 'pi pi-search', routerLink: ['/diseases'] },
      { label: 'Relatórios', icon: 'pi pi-chart-line', routerLink: ['/reports'] }
    ];
  }
}
