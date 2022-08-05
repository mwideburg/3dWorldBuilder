import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as THREE from "three";
import { UnitCreator } from "../interaction/unitCreator";
import { Orbit } from "../interaction/orbit";
import { DragAndDrop } from "../interaction/dragAndDrop";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
@Component({
    selector: "app-canvas",
    templateUrl: "./canvas.component.html",
    styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements OnInit {
    @ViewChild("renderCanvas", { static: true })
    public rendererCanvas: ElementRef<HTMLCanvasElement> | undefined;

    public scene: THREE.Scene = new THREE.Scene();

    constructor() {
        const scene = new THREE.Scene();
        this.scene = scene;
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            10000,
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        this.scene.add(camera);
        this.scene.background = new THREE.Color("white");
        camera.position.set(500, 800, 1300);
        camera.lookAt(0, 0, 0);
        // new OrbitControls(camera, renderer.domElement);
        const geometry1 = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry1, material);
        this.scene.add(cube);
        const gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(gridHelper);
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);

        const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        plane.name = "plane";
        this.scene.add(plane);
        const unitCreator = new UnitCreator(camera, [plane], this.scene);
        let currentControls: Orbit | UnitCreator | DragAndDrop = unitCreator;

        function controlSwitch(event: any): void {
            console.log(event.keyCode);

            switch (event.keyCode) {
                case 49:
                    currentControls.dispose();
                    currentControls = new Orbit(camera, renderer);
                    break;
                case 50:
                    currentControls.dispose();
                    currentControls = unitCreator;
                    unitCreator.activate();
                    break;
                case 51:
                    currentControls.dispose();
                    currentControls = new DragAndDrop(
                        unitCreator.objects.filter((obj) => obj.name !== "plane"),
                        unitCreator.objects.filter((obj) => obj.name === "plane"),
                        camera,
                        scene,
                    );
                    break;
                default:
                    break;
            }
        }

        document.addEventListener("keydown", controlSwitch);

        const render = (): void => {
            requestAnimationFrame(render);
            renderer.render(this.scene, camera);
        };

        function onWindowResize(): void {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

            render();
        }

        window.addEventListener("resize", onWindowResize);
        render();
    }

    ngOnInit(): void {
        console.log("START");
        // this.scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     1,
        //     10000,
        // );

        // const renderer = new THREE.WebGLRenderer();
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(renderer.domElement);
        // this.scene.add(camera);
        // this.scene.background = new THREE.Color("white");
        // camera.position.set(500, 800, 1300);
        // camera.lookAt(0, 0, 0);
        // // new OrbitControls(camera, renderer.domElement);
        // const geometry1 = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry1, material);
        // this.scene.add(cube);
        // const gridHelper = new THREE.GridHelper(1000, 20);
        // this.scene.add(gridHelper);
        // const geometry = new THREE.PlaneGeometry(1000, 1000);
        // geometry.rotateX(-Math.PI / 2);

        // const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        // plane.name = "plane";
        // this.scene.add(plane);
        // new UnitCreator(camera, [plane], this.scene);

        // function controlSwitch(event): void {
        //     switch (event.keyCode) {
        //         case 76:

        //         default:
        //             break;
        //     }
        // }

        // document.addEventListener("keydown", controlSwitch);

        // const render = (): void => {
        //     requestAnimationFrame(render);
        //     renderer.render(this.scene, camera);
        // };

        // function onWindowResize(): void {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();

        //     renderer.setSize(window.innerWidth, window.innerHeight);

        //     render();
        // }

        // window.addEventListener("resize", onWindowResize);
        // render();
    }
}
