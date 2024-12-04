import { NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';

import { WebcamComponent } from "./webcam.component";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [WebcamComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (platformLocation: PlatformLocation) => platformLocation.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
  ],
  exports: [WebcamComponent]
})
export class WebcamModule { }
