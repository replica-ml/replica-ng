import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";

import { MarkdownModule } from "ngx-markdown";

import { ScrapeService } from "../api/scrape/scrape.service";
import { SwapService } from "../api/swap/swap.service";
import { WebcamModule } from "../webcam/webcam.module";
import { SafePipe } from "../safe.pipe";
import { SecretService } from "./secret-service.service";
import { SecretDashboardComponent } from './secret-dashboard.component';
import { secretDashboardRoutes } from './secret-dashboard.routes';


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(secretDashboardRoutes), ReactiveFormsModule, FormsModule,
    MatSidenavModule, MatTabsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatStepperModule, MatIconModule, MatProgressSpinnerModule,
    MarkdownModule.forRoot(),
    SafePipe, WebcamModule
  ],
  providers: [SecretService, ScrapeService, SwapService],
  declarations: [SecretDashboardComponent]
})
export class SecretDashboardModule {
}
