import * as THREE from "three";

export default class Cube {

    static SIZE = 3;
    static DefaultColor = 0xa1d991;
    static SelectedColor = 0xff0000;

    object: any;

    constructor(position) {
        const geometry = new THREE.BoxGeometry(Cube.SIZE, Cube.SIZE, Cube.SIZE);
        const material = new THREE.MeshPhongMaterial({color: Cube.DefaultColor});

        const cube = new THREE.Mesh(geometry, material);
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.copy(position);

        this.object = cube;
    }

    getObject() {
        return this.object;
    }

}