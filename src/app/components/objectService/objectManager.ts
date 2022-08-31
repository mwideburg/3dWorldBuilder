import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as THREE from "three";

import { Cube } from "../units/cube";

@Injectable({
    providedIn: "root",
})
export class ObjectManager {
    objects: THREE.Mesh[] = [];

    addToScene$: Subject<THREE.Object3D> = new Subject();

    removeFromScene$: Subject<THREE.Object3D> = new Subject();

    attachObjectToScene$: Subject<THREE.Object3D> = new Subject();

    update$: Subject<boolean> = new Subject();

    isCopying: boolean = false;

    selectedGroup: THREE.Group = new THREE.Group();

    selectedUnit: THREE.Object3D | null = null;

    selectedUnitData$: Subject<THREE.Object3D | null> = new Subject();

    rollOverGroup: THREE.Group = new THREE.Group();

    // constructor(scene: THREE.Scene) {
    //     this.addToScene$.next(this.rollOverGroup);
    // }

    public addMeshToObjects(mesh: THREE.Mesh): void {
        this.objects.push(mesh);
        // console.log(this.objects);
    }

    public removeMeshFromObjects(mesh: THREE.Mesh): void {
        console.log("REMOVEING MESH", this.objects);
        this.objects = this.objects.filter((obj) => obj !== mesh);
        // console.log(this.objects);
    }

    public addCubeObject(cube: THREE.Object3D): void {
        const mesh = cube.children.find((obj) => obj.name === "cube");

        if (mesh && mesh instanceof THREE.Mesh) {
            this.addMeshToObjects(mesh);
        }
    }

    public removeCubeObject(cube: THREE.Object3D): void {
        const mesh = cube.children.find((obj) => obj.name === "cube");

        if (this.selectedGroup.children.includes(cube)) {
            this.selectedGroup.remove(cube);
        }

        if (mesh && mesh instanceof THREE.Mesh) {
            this.removeMeshFromObjects(mesh);
        }
    }

    public addUnitToSelectedGroup(object: THREE.Object3D): void {
        console.log(object);

        if (this.selectedGroup.children.includes(object)) {
            this.removeUnitFromSelectedGroup(object);
        } else {
            object.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                    mesh.material.color.set("red");
                    mesh.material.opacity = 1;
                }
            });
            this.selectedGroup.attach(object);
        }
    }

    public removeUnitFromSelectedGroup(object: THREE.Object3D): void {
        object.children.forEach((mesh) => {
            if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                mesh.material.color.set(0xaaaaaa);
            }
        });
        this.selectedGroup.remove(object);
        this.attachObjectToScene$.next(object);
    }

    public recolorSelectedGroup(): void {
        this.selectedGroup.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                    mesh.material.color.set("red");
                }
            });
        });
        this.update$.next(true);
    }

    public recolorOriginalObjects(): void {
        this.selectedGroup.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                    mesh.material.color.set(0xaaaaaa);
                }
            });
        });
        this.update$.next(true);
    }

    public combineUnitsIntoOne(): void {
        // comibing units that aren't in a line?
        // add width and depth by taking position and halving the width and depth
        // take min height or max
        if (this.selectedGroup.children.length !== 2) {
            return;
        }

        const meshes: any[] = [];
        const positions: any[] = [];
        this.selectedGroup.children.forEach((child: any) => {
            positions.push(child.position);
            child.children.forEach((c: THREE.Mesh) => {
                if (c instanceof THREE.Mesh) {
                    meshes.push(c);
                }
            });
        });
        const dims = { width: 0, depth: 0, height: 100 };

        // console.log(meshes);
        if (positions[0].x === positions[1].x) {
            // console.log("X's equal");
            dims.width = meshes[0].geometry.parameters.width;
            dims.depth = meshes[0].geometry.parameters.depth + meshes[1].geometry.parameters.depth;
        } else {
            dims.depth = meshes[0].geometry.parameters.depth;
            dims.width = meshes[0].geometry.parameters.width + meshes[1].geometry.parameters.width;
        }

        const cube = new Cube(dims);
        const position = new THREE.Vector3().add(positions[0]).add(positions[1]).divideScalar(2);
        cube.group.position.set(position.x, position.y, position.z);
        // console.log(this.objects);
        this.objects = this.objects.filter((obj) => {
            return !meshes.includes(obj);
        });

        this.objects.push(cube.mesh);
        this.addToScene$.next(cube.group);
        this.selectedGroup.clear();
    }

    public addRollOverGroup(): void {
        this.selectedGroup.children.forEach((child: any) => {
            child.children.forEach((mesh: any) => {
                if (mesh.name === "cube") {
                    const rollOverGeo = new THREE.BoxGeometry(
                        mesh.geometry.parameters.width,
                        mesh.geometry.parameters.height,
                        mesh.geometry.parameters.depth,
                    );
                    const rollOverMaterial = new THREE.MeshBasicMaterial({
                        color: 0xff0000,
                        opacity: 0.5,
                        transparent: true,
                    });

                    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
                    rollOverMesh.position.set(child.position.x, child.position.y, child.position.z);
                    this.rollOverGroup.add(rollOverMesh);
                }
            });
        });
        this.isCopying = true;
        this.addToScene$.next(this.rollOverGroup);
        // this.scene.add(this.rollOverCopyMeshGroup);
        console.log("COPYING UNITS");
    }

    public createCopyGroup(): void {
        this.rollOverGroup.children.forEach((child: any) => {
            const cube = new Cube({
                width: child.geometry.parameters.width,
                height: child.geometry.parameters.height,
                depth: child.geometry.parameters.depth,
            });

            cube.group.position.set(child.position.x, child.position.y, child.position.z);
            this.addCubeObject(cube.group);
            this.addToScene$.next(cube.group);
        });
        this.rollOverGroup.clear();
        this.isCopying = false;
    }

    public changeLevelOfSelectedGroup(level: number): void {
        // console.log(level);
        this.selectedGroup.children.forEach((child: THREE.Object3D) => {
            child.position.y += level * 100;
        });
        this.update$.next(true);
    }

    public deselectAllUnits(): void {
        this.recolorOriginalObjects();
        const allUnits = this.getAllSelectedUnits();
        allUnits.forEach((obj) => {
            this.removeUnitFromSelectedGroup(obj);
        });
        // this.selectedGroup.clear();
    }

    private getAllSelectedUnits(): THREE.Object3D[] {
        const allUnits: THREE.Object3D[] = [];
        this.selectedGroup.children.forEach((obj) => {
            allUnits.push(obj);
        });
        return allUnits;
    }

    public deleteSelectedUnits(): void {
        const allUnits = this.getAllSelectedUnits();
        // console.log("ALL", allUnits);

        this.deselectAllUnits();
        allUnits.forEach((obj) => {
            this.removeFromScene$.next(obj);
        });
    }

    public setNameOfSingleUnit(name: string): void {
        this.selectedGroup.children[0].name = name;
    }

    public selectSingleUnit(unit: THREE.Object3D | null): void {
        if (unit) {
            unit.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.set("black");
                }
            });
        }

        if (this.selectedUnit) {
            this.selectedUnit.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.set(0xaaaaaa);
                }
            });
        }

        this.selectedUnit = unit;
        this.selectedUnitData$.next(this.selectedUnit);
    }
}
