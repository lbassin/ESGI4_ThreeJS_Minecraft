import * as THREE from "three";

export default class Cube {

    static SIZE = 3;
    static TopColor = 0xa1d991;
    static SideColor = 0X80583c;

    static TopColorSelected = 0xff0000;
    static SideColorSelected = 0xff0000;

    static DefaultMaterial = [
        new THREE.MeshBasicMaterial({color: Cube.SideColor}),
        new THREE.MeshBasicMaterial({color: Cube.SideColor}),
        new THREE.MeshPhongMaterial({color: Cube.TopColor}),
        new THREE.MeshBasicMaterial({color: Cube.SideColor}),
        new THREE.MeshBasicMaterial({color: Cube.SideColor}),
        new THREE.MeshBasicMaterial({color: Cube.SideColor}),
    ];

    static SelectedMaterial = [
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshPhongMaterial({color: Cube.TopColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
    ];

    private material: any;

    object: any;

    constructor(position) {
        const geometry = new THREE.BoxGeometry(Cube.SIZE, Cube.SIZE, Cube.SIZE);


        const cube = new THREE.Mesh(geometry, this.material);
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.copy(position);
        cube.material = Cube.DefaultMaterial;

        this.object = cube;
    }

    getObject() {
        return this.object;
    }

}
//80583c