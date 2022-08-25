import * as THREE from "three";
import { Injectable } from "@angular/core";
import { ControllerService } from "../controller/controller.service";
import { RenderEngine } from "../renderer/renderEngine";
import { ObjectManager } from "../objectService/objectManager";
@Injectable({ providedIn: "root" })
export class ThreeManager {
    scene: THREE.Scene = new THREE.Scene();

    camera: THREE.PerspectiveCamera;

    constructor(
        public renderEngine: RenderEngine,
        private controllerService: ControllerService,
        private objectManager: ObjectManager,
    ) {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            60000,
        );
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.scene.background = new THREE.Color("white");
        this.scene.add(this.camera);
        const gridHelper = new THREE.GridHelper(5000, 100);
        gridHelper.position.y += 0.01;
        this.scene.add(gridHelper);
        const geometry = new THREE.PlaneGeometry(5000, 5000);
        geometry.rotateX(-Math.PI / 2);

        const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        plane.name = "plane";
        this.scene.add(plane);
        this.objectManager.objects.push(plane);
        this.renderEngine.createRenderEngine(this.scene, this.camera);
        this.controllerService.createController(this.camera, this.renderEngine.renderer);
        this.scene.add(this.controllerService.unitCreator.rollOverMesh);

        this.renderEngine.addControllerService(this.controllerService);
        this.controllerService.unitCreator.addObject$.subscribe((object: THREE.Object3D) => {
            this.objectManager.addCubeObject(object);
            this.scene.add(object);
            this.renderEngine.requestRenderIfNotRequested();
        });
        this.controllerService.unitCreator.removeObject$.subscribe((object: THREE.Object3D) => {
            this.objectManager.removeCubeObject(object);
            this.scene.remove(object);
            this.renderEngine.requestRenderIfNotRequested();
        });

        this.controllerService.selector.attachObjectToSelectedGroup$.subscribe(
            (object: THREE.Object3D) => {
                if (this.objectManager.selectedGroup.children.includes(object)) {
                    this.objectManager.removeUnitFromSelectedGroup(object);
                    console.log("ATACHING");
                } else {
                    this.objectManager.addUnitToSelectedGroup(object);
                }
            },
        );
        this.controllerService.selector.attachObjectToScene$.subscribe((object: THREE.Object3D) => {
            console.log("ATACHING");
            this.objectManager.removeUnitFromSelectedGroup(object);
        });
        // this.controllerService.selector.requestAnimation$.subscribe(() => {
        //     this.renderEngine.requestRenderIfNotRequested();
        // });
        this.controllerService.requestAnimation$.subscribe(() => {
            this.renderEngine.requestRenderIfNotRequested();
        });

        this.scene.add(this.objectManager.selectedGroup);
        this.controllerService.currentController$.subscribe((type: string) => {
            switch (type) {
                case "selector":
                    this.objectManager.recolorSelectedGroup();
                    this.controllerService.selector.activate();

                    break;
                case "unitCreator":
                    this.objectManager.recolorOriginalObjects();
                    this.controllerService.unitCreator.activate();
                    break;
                default:
                    break;
            }
        });

        this.objectManager.attachObjectToScene$.subscribe((object: THREE.Object3D) => {
            this.scene.attach(object);
        });
        this.objectManager.addToScene$.subscribe((object: THREE.Object3D) => {
            this.scene.add(object);
        });
        this.controllerService.combineUnits$.subscribe(() => {
            this.objectManager.combineUnitsIntoOne();
            this.renderEngine.requestRenderIfNotRequested();
        });

        this.controllerService.selector.createCopyGroup$.subscribe(() => {
            this.objectManager.createCopyGroup();
        });
    }
}
