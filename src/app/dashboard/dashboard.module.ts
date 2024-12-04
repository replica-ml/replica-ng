import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListItem } from "@angular/material/list";

import { AuthService } from "../api/auth/auth.service";
import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(dashboardRoutes),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListItem
  ],
  declarations: [DashboardComponent],
  providers: [AuthService],
  exports: [DashboardComponent]
})
export class DashboardModule {
}
