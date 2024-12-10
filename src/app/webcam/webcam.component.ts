import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import { DataUrlService } from "../data-url.service";


@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WebcamComponent implements AfterContentInit, OnDestroy {
  private activeWebcam: boolean = false;

  constructor(private dataUrlService: DataUrlService) {
  }

  showStartupButton = true

  width = 320; // We will scale the photo width to this
  height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether we're currently streaming
  // video from the camera. Obviously, we start at false.

  streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  @ViewChild('video', {static: true, read: ElementRef})
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas', {static: true, read: ElementRef})
  canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('photo', {static: true, read: ElementRef})
  photo!: ElementRef<HTMLImageElement>;

  @ViewChild('startButton', {static: true, read: ElementRef})
  startButton!: ElementRef<HTMLButtonElement>;

  showViewLiveResultButton() {
    if (window.self !== window.top) {
      // Ensure that if our document is in a frame, we get the user
      // to first open it in its own tab or window. Otherwise, it
      // won't be able to request permission for camera access.
      document?.querySelector(".content-area")?.remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  startup() {
    if (this.showViewLiveResultButton()) return;

    navigator.mediaDevices
      .getUserMedia({video: true, audio: false})
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play().catch(console.error);
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    this.video.nativeElement.addEventListener(
      "canplay",
      (_ev) => {
        if (!this.streaming) {
          this.height = this.video.nativeElement.videoHeight /
            (this.video.nativeElement.videoWidth / this.width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(this.height)) {
            this.height = this.width / (4 / 3);
          }

          this.video.nativeElement.setAttribute("width", this.width.toString());
          this.video.nativeElement.setAttribute("height", this.height.toString());
          this.canvas.nativeElement.setAttribute("width", this.width.toString());
          this.canvas.nativeElement.setAttribute("height", this.height.toString());
          this.streaming = true;
        }
      },
      false,
    );

    this.startButton.nativeElement.addEventListener(
      "click",
      (ev) => {
        if (this.activeWebcam) this.takePicture();
        else this.startupButtonOnClick();
        ev.preventDefault();
      },
      false,
    );

    this.clearPhoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  clearPhoto() {
    const context = this.canvas.nativeElement.getContext("2d");
    if (context == null) return;
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    const data = this.canvas.nativeElement.toDataURL("image/png");
    this.photo.nativeElement.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  takePicture() {
    const context = this.canvas.nativeElement.getContext("2d");
    if (context == null) return;
    if (this.width && this.height) {
      this.canvas.nativeElement.width = this.width;
      this.canvas.nativeElement.height = this.height;
      context.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

      const data = this.canvas.nativeElement.toDataURL("image/png");
      this.dataUrlService.userPhotoUrl$.next(data);
      this.photo.nativeElement.setAttribute("src", data);
      this.destroy();
    } else {
      this.clearPhoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  @Output() stopMedia = new EventEmitter<boolean>();

  ngAfterContentInit() {
    //this.startup();
  }

  startupButtonOnClick() {
    this.activeWebcam = true;
    this.showStartupButton = false;
    this.startup()
    this.stopMedia.subscribe(stop => {
      console.info(stop, " this.stopMedia")
      if (stop) this.destroy();
    });
  }

  ngOnDestroy() {
    console.info("destroyed")
    this.destroy();
  }

  destroy() {
    this.activeWebcam = false;
    const srcObject = this.video.nativeElement.srcObject;
    if (srcObject == null) return;
    else if ("getTracks" in srcObject) {
      srcObject.getTracks().forEach((track) =>
        track.stop()
      );
    }
  }
}

/*
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WebcamComponent implements OnInit, OnDestroy {
  @ViewChild('btnPhoto', { static: true, read: ElementRef })
  btnPhoto!: ElementRef<HTMLButtonElement>;

  @ViewChild('snap', { static: true, read: ElementRef })
  snap!: ElementRef<HTMLAudioElement>;

  @ViewChild('video', { static: true, read: ElementRef })
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('photo', { static: true, read: ElementRef })
  canvas!: ElementRef<HTMLCanvasElement>;

  destroy$ = new Subject<void>();

  photoStripe$!: Observable<Photo[]>;

  constructor(@Inject(APP_BASE_HREF) private baseHref: string, @Inject(NAVIGATOR) private navigator: Navigator) {}

  ngOnInit(): void {
    const videoNative = this.video.nativeElement;
    const canvasNative = this.canvas.nativeElement;
    const ctx = canvasNative.getContext('2d', { willReadFrequently: true });

    this.getVideo();

    this.photoStripe$ = fromEvent(this.btnPhoto.nativeElement, 'click').pipe(
      tap(() => {
        const snapElement = this.snap.nativeElement;
        snapElement.currentTime = 0;
        snapElement.play();
      }),
      map(() => ({
        data: this.canvas.nativeElement.toDataURL('image/jpeg'),
        description: 'My photo',
        download: 'photo',
      })),
      scan((photos, photo) => [photo, ...photos], [] as Photo[]),
      startWith([] as Photo[]),
    );

    fromEvent(videoNative, 'canplay')
      .pipe(
        filter(() => !!ctx),
        map(() => ctx as CanvasRenderingContext2D),
        concatMap((canvasContext) => {
          const width = videoNative.videoWidth;
          const height = videoNative.videoHeight;
          canvasNative.width = width;
          canvasNative.height = height;
          const interval = 16;

          return timer(0, interval).pipe(
            tap(() => {
              canvasContext.drawImage(
                this.video.nativeElement,
                0,
                0,
                width,
                height
              );
              // take the pixels out
              const pixels = canvasContext.getImageData(0, 0, width, height);

              //this.rgbSplit(pixels);
              canvasContext.globalAlpha = 0.8;
              canvasContext.putImageData(pixels, 0, 0);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getVideo() {
    console.log('navigator', this.navigator);

    this.navigator?.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localMediaStream) => {
        console.log(localMediaStream);

        const nativeElement = this.video.nativeElement;
        nativeElement.srcObject = localMediaStream;
        nativeElement.play().catch(console.error);
      })
      .catch((err) => {
        console.error(`OH NO!!!`, err);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
*/
