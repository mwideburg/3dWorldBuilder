import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ObjectManager } from "../objectService/objectManager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { bufferTime, distinctUntilChanged, filter, fromEvent, map, Subject } from "rxjs";
// idle camera
// header interactions
// remove black material on boats
// all models need to be gray
// rv site, optimize models find new models
// derive 3d model based on radius polygon shape

@Injectable({ providedIn: "root" })
export class InteractionService {
    canvas!: HTMLCanvasElement;

    controls!: OrbitControls;

    raycaster: THREE.Raycaster;

    mouse: THREE.Vector2;

    camera: THREE.PerspectiveCamera;

    domElement!: HTMLElement;

    isPinching: boolean = false;

    evCache: any[] = [];

    click$: Subject<boolean> = new Subject();

    pointerMove$: Subject<boolean> = new Subject();

    isShiftDown: boolean = false;

    commandIsDown: boolean = false;

    dblClicked$: Subject<boolean> = new Subject();

    dblClicked: boolean = false;

    pointerIsDown: boolean = false;

    eventKeyListenersDisabled: boolean = false;

    pointerIsDown$: Subject<boolean> = new Subject();

    constructor(public objectService: ObjectManager) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const aspect = width / height;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    public initializeFromCanvas(canvasElement: HTMLCanvasElement): void {
        this.canvas = canvasElement;
        this.establishPointerListeners();
        // this.establishPointerListeners();
    }

    public createInteractions(
        domElement: HTMLElement,
        camera: THREE.PerspectiveCamera,
    ): OrbitControls {
        this.domElement = domElement;
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);

        // AB 03/25/22 enable damping for more natual interaction
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;

        this.controls.zoomSpeed = 0.5;

        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
        };

        this.controls.screenSpacePanning = true;

        // AB adjust this so that lowest angle is slightly
        // above ground

        this.controls.update();

        // this.controls.minAzimuthAngle = -20
        // this.controls.minAzimuthAngle = -20
        // this.getLastPosition();
        this.establishPointerListeners();
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
        this.pointerMove = this.pointerMove.bind(this);

        document.addEventListener("keydown", this.onDocumentKeyDown);
        document.addEventListener("keyup", this.onDocumentKeyUp);
        return this.controls;
    }

    public diasbleEventKeys(): void {
        document.removeEventListener("keydown", this.onDocumentKeyDown);
        document.removeEventListener("keyup", this.onDocumentKeyUp);
        this.eventKeyListenersDisabled = true;
    }

    public enableEventKeys(): void {
        document.addEventListener("keydown", this.onDocumentKeyDown);
        document.addEventListener("keyup", this.onDocumentKeyUp);
    }

    private establishPointerListeners(): void {
        if (!this.domElement) {
            return;
        }

        const nativeElement = this.domElement;
        // pointerup obervable
        // ----------------------------------------------------------------------
        // console.log("HELLO");
        const pointerUp$ = fromEvent(nativeElement, "pointerup");
        const pointerDown$ = fromEvent(nativeElement, "pointerdown");
        const pointerMove$ = fromEvent(nativeElement, "pointermove");
        const doubleClick$ = pointerUp$.pipe(
            map((event: Event) => [Date.now(), event]),
            // In a 250ms window, check for 2 entries in the buffer every 50ms
            bufferTime(250, 50, 2),
            // filter out buffers where there are 2 entries (for double click)
            filter((l) => l.length === 2),
            // ensure the two timestamps are different
            distinctUntilChanged((a, b) => a[0] == b[0] && a[1] == b[1]),
        );
        pointerDown$.subscribe((ev: any) => {
            this.evCache.push(ev);

            if (this.evCache.length > 1) {
                this.isPinching = true;
            }

            if (this.commandIsDown) {
                this.pointerIsDown$.next(true);
            }

            this.pointerIsDown = true;
            // console.log(this.evCache);
        });
        pointerUp$.subscribe((ev: any) => {
            for (var i = 0; i < this.evCache.length; i++) {
                if (this.evCache[i].pointerId == ev.pointerId) {
                    this.evCache.splice(i, 1);
                    break;
                }
            }

            if (!this.evCache.length && this.isPinching) {
                setTimeout(() => {
                    this.isPinching = false;
                }, 50);
            }

            this.pointerIsDown = false;
            // console.log(this.evCache);
        });

        // click will select unit no mater what so dblClick just needs to move camera and not select Unit
        // ----------------------------------------------------------------------
        pointerDown$.subscribe((down: any) => {
            pointerUp$.subscribe((up: any) => {
                if (!this.isPinching && !this.dblClicked) {
                    if (up.timeStamp - down.timeStamp < 150 && !this.dblClicked) {
                        // const intersect = this.click(down);
                        // if (intersect) {
                        //     this.click(intersect);
                        // } else {
                        //     this.objectService.removeHover();
                        //     this.hoverSummaryService.hide();
                        // }
                        this.click(down);
                    }
                } else {
                    if (up.timeStamp - down.timeStamp < 150 && this.dblClicked) {
                        this.dblClick(down);
                    }
                }

                // console.log("UP DOWN", up.timeStamp, down.timeStamp);
                // return [down, up];
            });
        });

        pointerMove$.subscribe((event: any) => {
            // console.log(this.commandIsDown);

            this.pointerMove(event);
        });

        doubleClick$.subscribe((event: any) => {
            this.dblClicked = true;
            this.dblClick(event[0][1]);

            if (!this.isPinching) {
                // console.log("Double tap", event);
            }
        });
    }

    public disable(): void {
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
        this.controls.enableZoom = false;
    }

    public activate(): void {
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.enableZoom = true;

        if (this.eventKeyListenersDisabled) {
            this.enableEventKeys();
        }
    }

    private onDocumentKeyDown(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = true;
                // console.log(this.isShiftDown);
                break;
            case 83:
                this.commandIsDown = true;
                this.controls.enablePan = false;
                this.controls.enableZoom = false;
                this.controls.enableRotate = false;
                // console.log("DISABLING CONTROLS");
                break;
        }
    }

    private onDocumentKeyUp(event: any): void {
        // console.log(event.keyCode);

        switch (event.keyCode) {
            case 16:
                this.isShiftDown = false;

                break;
            case 83:
                this.commandIsDown = false;
                this.controls.enablePan = true;
                this.controls.enableZoom = true;
                this.controls.enableRotate = true;
                // console.log("ENABLING CONTROLS");
                // console.log(this.isShiftDown);
                break;
        }
    }

    private pointerMove(event: MouseEvent): any {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // const intersects = this.raycaster.intersectObjects(this.objectService.objects);

        this.pointerMove$.next(true);
    }

    private click(event: MouseEvent): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        // const intersects = this.raycaster.intersectObjects(this.objectService.objects);
        this.click$.next(this.isShiftDown);
    }

    private dblClick(event: MouseEvent): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.dblClicked$.next(true);
        this.dblClicked = false;
    }
}
