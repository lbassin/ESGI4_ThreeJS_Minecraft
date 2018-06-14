import Cube from "./Cube";
import * as THREE from "three";

export default class RandomGenerator {

    scene: any;

    generate(world) {
        this.scene = world.scene;

        for(let i = 0; i < 20; i++){
            const position = new THREE.Vector3(Cube.SIZE * i, 0, 0);
            this.addCube(position);
        }
    }

    addCube(position = new THREE.Vector3(0, 0, 0)) {
        const cube = new Cube(position);
        this.scene.add(cube.getObject());
    }

}