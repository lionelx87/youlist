import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularSvgIconModule,
    ButtonModule,
    RippleModule,
    PanelModule,
    MenuModule,
  ],
})
export class HomeModule {}
