import Cube from "./Cube";
import * as THREE from "three";

export default class RandomGenerator {

    scene: any;

    sizeX = 30;
    sizeY = 30;

    generate(world) {
        this.scene = world.scene;

        for (let i = 0; i < this.sizeX; i++) {
            for (let e = 0; e < this.sizeY; e++) {
                const position = new THREE.Vector3(Cube.SIZE * i, 0, Cube.SIZE * e);
                this.addCube(position);
            }
        }
    }

    addCube(position = new THREE.Vector3(0, 0, 0)) {
        const cube = new Cube(position);
        this.scene.add(cube.getObject());
    }

}