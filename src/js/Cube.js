import * as THREE from "three";

export default class World {

    constructor() {
        const geometry = new THREE.BoxGeometry(15, 15, 15);
        const material = new THREE.MeshPhongMaterial({color: 0x90ca48});

        const cube = new THREE.Mesh(geometry, material);
        cube.rotation.y = Math.PI / 4;
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.y = 25;

        this.object = cube;
    }

    getObject() {
        return this.object;
    }

}