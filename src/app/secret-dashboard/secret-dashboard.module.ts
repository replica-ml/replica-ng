import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";

import { MarkdownModule } from "ngx-markdown";

import { ScrapeService } from "../api/scrape/scrape.service";
import { SafePipe } from "../safe.pipe";
import { SecretDashboardComponent } from './secret-dashboard.component';
import { secretDashboardRoutes } from './secret-dashboard.routes';
import { SecretService } from "./secret-service.service";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { WebcamModule } from "../webcam/webcam.module";


@NgModule({
  imports: [
    CommonModule, RouterModule, RouterModule.forChild(secretDashboardRoutes), ReactiveFormsModule, FormsModule,
    MatSidenavModule, MatTabsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatStepperModule, MatIconModule, MatProgressSpinnerModule,
    MarkdownModule.forRoot(),
    SafePipe, WebcamModule
  ],
  providers: [SecretService, ScrapeService],
  declarations: [SecretDashboardComponent]
})
export class SecretDashboardModule {
}
